// DTO representing the payload required to create an Object
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateObjectDto {
  // Human-readable title of the Object
  @IsString()
  @IsNotEmpty()
  title!: string;

  // Detailed description of the Object
  @IsString()
  @IsNotEmpty()
  description!: string;

  // Public URL of the uploaded image stored in S3
  @IsString()
  @IsNotEmpty()
  imageUrl!: string;
}
