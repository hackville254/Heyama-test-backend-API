import { Injectable } from '@nestjs/common';
import {
  S3Client,
  DeleteObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Service responsible for S3 presigned URLs and object deletion
@Injectable()
export class S3Service {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly region: string;

  constructor() {
    // Initialize S3 client using environment variables (no .env file required)
    this.region = process.env.AWS_REGION ?? '';
    this.bucket = process.env.S3_BUCKET_NAME ?? '';
    this.client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
      },
    });
  }

  // Generates a presigned URL for uploading a file directly to S3
  async generateUploadUrl(params: {
    key: string; // S3 object key where the file will be uploaded
    contentType: string; // MIME type of the file
    expiresInSeconds?: number; // URL expiration in seconds
  }): Promise<{ uploadUrl: string; publicUrl: string; key: string }> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: params.key,
      ContentType: params.contentType,
    });

    const uploadUrl = await getSignedUrl(this.client, command, {
      expiresIn: params.expiresInSeconds ?? 900, // default 15 minutes
    });

    const publicUrl = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${params.key}`;
    return { uploadUrl, publicUrl, key: params.key };
  }

  // Deletes an object from S3 using its key
  async deleteByKey(key: string): Promise<void> {
    const command = new DeleteObjectCommand({ Bucket: this.bucket, Key: key });
    await this.client.send(command);
  }

  // Utility to derive the S3 object key from a public URL
  keyFromUrl(url: string): string {
    const prefix = `https://${this.bucket}.s3.${this.region}.amazonaws.com/`;
    return url.startsWith(prefix) ? url.slice(prefix.length) : url;
  }
}
