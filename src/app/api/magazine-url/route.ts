import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

// Force dynamic so Next.js never statically caches this route —
// the PDF must be fetched fresh on every request.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = new S3Client({ region: process.env.AWS_REGION ?? 'us-east-1' });
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: 'community-issue-2.pdf',
    });
    const s3Response = await client.send(command);

    if (!s3Response.Body) {
      return new Response('PDF not found', { status: 404 });
    }

    // Proxy the PDF through the server — the browser talks to our Vercel function,
    // not S3 directly, so no CORS config needed on the bucket.
    const stream = s3Response.Body.transformToWebStream();
    return new Response(stream, {
      headers: {
        'Content-Type': 'application/pdf',
        // Cache aggressively on the CDN — the PDF rarely changes
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err) {
    console.error('Failed to proxy magazine PDF:', err);
    return new Response('Failed to load magazine', { status: 500 });
  }
}
