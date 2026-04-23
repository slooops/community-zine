<div align="center">
  <img src="public/title-red.svg" width="380" alt="ComMunity" />
  <p><strong>SF's Independent Transit Magazine</strong></p>
  <p>
    <a href="https://t2x9fbqpmx.us-west-2.awsapprunner.com">🚌 Live site</a>
    &nbsp;·&nbsp;
    <a href="https://t2x9fbqpmx.us-west-2.awsapprunner.com/read">Read Issue 2</a>
    &nbsp;·&nbsp;
    <a href="https://t2x9fbqpmx.us-west-2.awsapprunner.com/subscribe">Subscribe</a>
  </p>
</div>

---

ComMunity is a free, independent print magazine about life on San Francisco's Muni — the buses, trains, cable cars, and the people who ride them every day. This repo is the website: read Issue 2 free online, or subscribe for $5/month to get print copies mailed to your door.

## Stack

- **Next.js 14** (App Router, TypeScript, Tailwind CSS)
- **react-pdf** — in-browser PDF viewer with two-page spread on desktop, single page on mobile
- **Stripe Checkout** — variable-amount recurring subscriptions (Apple Pay / Google Pay)
- **AWS App Runner** — containerized hosting via Docker → ECR
- **AWS DynamoDB** — subscriber records
- **AWS SES** — owner email notification on each new subscriber
- **AWS S3** — private PDF storage with presigned URLs

## Local dev

```bash
npm install
cp .env.example .env.local   # fill in your keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The PDF viewer calls `/api/magazine-url` which generates a presigned S3 URL — you'll need real AWS credentials and an S3 bucket with the PDF uploaded for that to work locally.

## Deployment

Pushes to `main` automatically build and deploy via GitHub Actions (`.github/workflows/deploy.yml`):

1. Builds a `linux/amd64` Docker image
2. Pushes to AWS ECR
3. Triggers an App Runner deployment

**Required GitHub repo secrets:** `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`

The live environment runs on AWS App Runner (`us-west-2`). Environment variables are managed directly in App Runner — see `.env.example` for the full list.
