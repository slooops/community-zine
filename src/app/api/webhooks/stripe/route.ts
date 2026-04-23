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

    if (session.mode !== 'subscription') {
      return new Response('OK', { status: 200 });
    }

    try {
      // Retrieve the subscription to get the confirmed price/amount
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      const priceItem = subscription.items.data[0];
      const amountCents = priceItem.price.unit_amount ?? 500;
      const priceId = priceItem.price.id;

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
        stripeSubscriptionId: session.subscription as string,
        stripePriceId: priceId,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await docClient.send(
        new PutCommand({ TableName: TABLE_NAME, Item: subscriber }),
      );

      await sendOwnerNotification(subscriber);
    } catch (err) {
      console.error('Failed to process subscription:', err);
      // Return 500 so Stripe retries the webhook
      return new Response('Internal error', { status: 500 });
    }
  }

  // Handle subscription status changes to keep DynamoDB in sync
  if (
    event.type === 'customer.subscription.updated' ||
    event.type === 'customer.subscription.deleted'
  ) {
    // Status sync is optional for v1 — log for visibility
    const sub = event.data.object as Stripe.Subscription;
    console.log(`Subscription ${sub.id} status: ${sub.status}`);
  }

  return new Response('OK', { status: 200 });
}
