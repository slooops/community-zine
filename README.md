<div align="center">
  <img src="public/title-red.svg" width="380" alt="ComMunity" />
  <p><strong>SF's Independent Transit Magazine</strong></p>
  <p>
    <a href="https://community-zine.vercel.app">🚌 Live site</a>
    &nbsp;·&nbsp;
    <a href="https://community-zine.vercel.app/read">Read Issue 2</a>
    &nbsp;·&nbsp;
    <a href="https://community-zine.vercel.app/subscribe">Get a Print Copy</a>
  </p>
</div>

---

ComMunity is a free, independent print magazine about life on San Francisco's Muni — the buses, trains, cable cars, and the people who ride them every day. This repo is the website: read Issue 2 free online, or buy a print copy to get it mailed to your door.

## Stack

- **Next.js 14** (App Router, TypeScript, Tailwind CSS)
- **react-pdf** — in-browser PDF viewer with two-page spread on desktop, single page on mobile
- **Stripe Checkout** — one-time purchase flow (Apple Pay / Google Pay) — wiring in progress
- **Vercel** — hosting with automatic deploys from `main`
- **AWS DynamoDB** — order records
- **AWS SES** — owner email notification on each new order
- **AWS S3** — PDF storage, proxied through the Vercel API (no CORS config needed)

## Local dev

```bash
npm install
cp .env.example .env.local   # fill in your keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The PDF viewer calls `/api/magazine-url` which generates a presigned S3 URL — you'll need real AWS credentials and an S3 bucket with the PDF uploaded for that to work locally.

## Deployment

Pushes to `main` automatically deploy to Vercel. No manual steps needed.

Environment variables are managed in the Vercel project dashboard (`slooops-projects/community-zine`). See `.env.local` for the full list of required keys.
