import { PutCommand } from '@aws-sdk/lib-dynamodb';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { docClient, TABLE_NAME } from '@/lib/dynamodb';
import { sendOwnerNotification } from '@/lib/ses';
import type { Subscriber } from '@/lib/types';

// Must use Node.js runtime — Edge runtime cannot read raw body for webhook verification
export const runtime = 'nodejs';

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return new Response('Missing stripe-signature header', { status: 400 });
  }

  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new Response('Webhook signature verification failed', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.mode !== 'payment') {
      return new Response('OK', { status: 200 });
    }

    try {
      const amountCents = session.amount_total ?? 500;

      const subscriber: Subscriber = {
        subscriberId: crypto.randomUUID(),
        email: session.customer_details?.email ?? session.metadata?.email ?? '',
        name: session.metadata?.name ?? '',
        address: {
          line1: session.metadata?.address_line1 ?? '',
          line2: session.metadata?.address_line2 || undefined,
          city: session.metadata?.city ?? '',
          state: session.metadata?.state ?? '',
          zip: session.metadata?.zip ?? '',
        },
        amountCents,
        stripeCustomerId: session.customer as string,
        stripePaymentIntentId: session.payment_intent as string,
        status: 'paid',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await docClient.send(
        new PutCommand({ TableName: TABLE_NAME, Item: subscriber }),
      );

      await sendOwnerNotification(subscriber);
    } catch (err) {
      console.error('Failed to process order:', err);
      // Return 500 so Stripe retries the webhook
      return new Response('Internal error', { status: 500 });
    }
  }

  return new Response('OK', { status: 200 });
}
