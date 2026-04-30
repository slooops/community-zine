import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import type { Subscriber } from './types';

const sesClient = new SESClient({ region: process.env.AWS_REGION ?? 'us-east-1' });

export async function sendOwnerNotification(subscriber: Subscriber) {
  const dollars = (subscriber.amountCents / 100).toFixed(2);
  const { line1, line2, city, state, zip } = subscriber.address;
  const addressStr = [line1, line2, `${city}, ${state} ${zip}`]
    .filter(Boolean)
    .join('\n');

  const subject = `New ComMunity print order: ${subscriber.name} — $${dollars}`;

  const text = `New print order!\n\nName: ${subscriber.name}\nEmail: ${subscriber.email}\nAmount: $${dollars}\n\nMailing address:\n${addressStr}\n\nStripe customer: ${subscriber.stripeCustomerId}\nPayment intent: ${subscriber.stripePaymentIntentId}`;

  const html = `
<h2>New print order!</h2>
<table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
  <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Name</td><td>${subscriber.name}</td></tr>
  <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Email</td><td>${subscriber.email}</td></tr>
  <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Amount</td><td>$${dollars}</td></tr>
  <tr><td style="padding:4px 12px 4px 0;font-weight:bold;vertical-align:top">Mailing address</td><td style="white-space:pre">${addressStr}</td></tr>
  <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Stripe customer</td><td>${subscriber.stripeCustomerId}</td></tr>
  <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Payment intent</td><td>${subscriber.stripePaymentIntentId}</td></tr>
</table>`;

  await sesClient.send(
    new SendEmailCommand({
      Source: process.env.SES_FROM_EMAIL!,
      Destination: { ToAddresses: [process.env.OWNER_EMAIL!] },
      Message: {
        Subject: { Data: subject },
        Body: {
          Text: { Data: text },
          Html: { Data: html },
        },
      },
    }),
  );
}
