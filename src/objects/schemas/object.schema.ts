import { Schema, Document } from 'mongoose';

// Object MongoDB document interface
// Describes the shape stored in MongoDB for the “Object” resource
export interface ObjectDoc extends Document {
  title: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
}

// Mongoose schema defining the Object shape
// This schema is registered via MongooseModule.forFeature in ObjectsModule
export const ObjectSchema = new Schema<ObjectDoc>(
  {
    // Required title
    title: { type: String, required: true },

    // Required description
    description: { type: String, required: true },

    // Required public URL of the image stored in S3
    imageUrl: { type: String, required: true },

    // Creation timestamp (default to now)
    createdAt: { type: Date, default: () => new Date() },
  },
  {
    // Hide __v version key
    versionKey: false,
  },
);
