import { IsString } from 'class-validator';

export class UploadUrlDto {
  @IsString()
  filename!: string;

  @IsString()
  contentType!: string;
}
