import { getMagazinePresignedUrl } from '@/lib/s3';

export async function GET() {
  try {
    const url = await getMagazinePresignedUrl();
    return Response.json({ url });
  } catch (err) {
    console.error('Failed to generate presigned URL:', err);
    return Response.json({ error: 'Failed to load magazine' }, { status: 500 });
  }
}
