import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getIssue } from '@/lib/issues';

const s3Client = new S3Client({ region: process.env.S3_REGION ?? process.env.AWS_REGION ?? 'us-east-1' });

export async function getMagazinePresignedUrl(issueSlug?: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: getIssue(issueSlug).s3Key,
  });
  return getSignedUrl(s3Client, command, { expiresIn: 900 }); // 15 minutes
}
