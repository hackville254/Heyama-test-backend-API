// DTO representing the payload required to generate a presigned upload URL
import { IsString, IsNotEmpty } from 'class-validator';

export class UploadUrlDto {
  // Original filename (used to create the S3 object key)
  @IsString()
  @IsNotEmpty()
  filename!: string;

  // MIME type of the file to be uploaded
  @IsString()
  @IsNotEmpty()
  contentType!: string;
}
