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
  private readonly endpoint?: string;
  private readonly forcePathStyle: boolean;

  constructor() {
    // Initialize S3 client using environment variables (supports AWS and S3-compatible providers)
    this.region = process.env.AWS_REGION ?? '';
    this.bucket = process.env.S3_BUCKET_NAME ?? '';
    this.endpoint = process.env.S3_ENDPOINT;
    this.forcePathStyle = ((process.env.S3_FORCE_PATH_STYLE ?? 'false') + '')
      .toLowerCase() === 'true';

    this.client = new S3Client({
      region: this.region,
      endpoint: this.endpoint,
      forcePathStyle: this.forcePathStyle,
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

    // Derive the public URL based on endpoint and path style configuration
    const publicUrl = this.computePublicUrl(params.key);
    return { uploadUrl, publicUrl, key: params.key };
  }

  // Deletes an object from S3 using its key
  async deleteByKey(key: string): Promise<void> {
    const command = new DeleteObjectCommand({ Bucket: this.bucket, Key: key });
    await this.client.send(command);
  }

  // Utility to derive the S3 object key from a public URL
  keyFromUrl(url: string): string {
    // Handle path-style with custom endpoint: https://endpoint/bucket/key
    if (this.endpoint && this.forcePathStyle) {
      const base = this.stripTrailingSlash(this.endpoint);
      const prefix = `${base}/${this.bucket}/`;
      return url.startsWith(prefix) ? url.slice(prefix.length) : url;
    }

    // Default AWS virtual-hosted-style: https://bucket.s3.region.amazonaws.com/key
    const awsPrefix = `https://${this.bucket}.s3.${this.region}.amazonaws.com/`;
    return url.startsWith(awsPrefix) ? url.slice(awsPrefix.length) : url;
  }

  // Computes the public URL for an object key depending on endpoint configuration
  private computePublicUrl(key: string): string {
    // If an explicit endpoint is provided and path-style is enforced, construct: endpoint/bucket/key
    if (this.endpoint && this.forcePathStyle) {
      const base = this.stripTrailingSlash(this.endpoint);
      return `${base}/${this.bucket}/${key}`;
    }

    // If an explicit endpoint is provided without path-style, best-effort: endpoint/key
    // Note: Many S3-compatible providers prefer path-style; virtual-hosted requires DNS setup.
    if (this.endpoint) {
      const base = this.stripTrailingSlash(this.endpoint);
      return `${base}/${key}`;
    }

    // Default AWS virtual-hosted-style
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }

  // Remove trailing slash from a URL if present
  private stripTrailingSlash(url: string): string {
    return url.endsWith('/') ? url.slice(0, -1) : url;
  }
}
