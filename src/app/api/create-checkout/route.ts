import { z } from 'zod';
import { getStripe } from '@/lib/stripe';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  address: z.object({
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    zip: z.string().min(1),
  }),
  amountCents: z.number().int().min(500),
});

export async function POST(req: Request) {
  let body: z.infer<typeof schema>;
  try {
    body = schema.parse(await req.json());
  } catch {
    return Response.json({ error: 'Invalid request data' }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    // Create a Stripe Customer so we can attach billing details
    const customer = await stripe.customers.create({
      name: body.name,
      email: body.email,
      metadata: {
        address_line1: body.address.line1,
        address_line2: body.address.line2 ?? '',
        city: body.address.city,
        state: body.address.state,
        zip: body.address.zip,
      },
    });

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: body.amountCents,
            product_data: {
              name: 'ComMunity Magazine — Issue 2 Print Copy',
              description: 'Physical print copy mailed to your door.',
            },
          },
        },
      ],
      payment_method_types: ['card'],
      // Apple Pay & Google Pay appear automatically in Stripe Checkout
      // when the user's browser/device supports them
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscribe`,
      // Store address in session metadata so the webhook can write it to DynamoDB
      metadata: {
        name: body.name,
        address_line1: body.address.line1,
        address_line2: body.address.line2 ?? '',
        city: body.address.city,
        state: body.address.state,
        zip: body.address.zip,
      },
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout creation failed:', err);
    return Response.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
