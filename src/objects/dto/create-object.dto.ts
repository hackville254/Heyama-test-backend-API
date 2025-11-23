// DTO representing the payload required to create an Object
export class CreateObjectDto {
  // Human-readable title of the Object
  title!: string;

  // Detailed description of the Object
  description!: string;

  // Public URL of the uploaded image stored in S3
  imageUrl!: string;
}
