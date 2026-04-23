import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION ?? 'us-east-1',
  // In App Runner, credentials come from the instance IAM role automatically.
  // For local dev, set AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY in .env.local,
  // or use a local DynamoDB endpoint via DYNAMODB_ENDPOINT.
  ...(process.env.DYNAMODB_ENDPOINT
    ? { endpoint: process.env.DYNAMODB_ENDPOINT }
    : {}),
});

export const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});

export const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME ?? 'community-subscribers';
