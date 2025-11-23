import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { ObjectDoc } from './schemas/object.schema';

// Service encapsulating business logic around Objects collection
@Injectable()
export class ObjectsService {
  constructor(
    @Inject('OBJECT_MODEL') private readonly objectModel: Model<ObjectDoc>,
  ) {}

  // Creates and persists a new Object document
  async create(params: {
    title: string;
    description: string;
    imageUrl: string;
  }): Promise<ObjectDoc> {
    const created = new this.objectModel({
      title: params.title,
      description: params.description,
      imageUrl: params.imageUrl,
    });
    return created.save();
  }

  // Returns all Object documents
  async findAll(): Promise<ObjectDoc[]> {
    return this.objectModel.find().sort({ createdAt: -1 }).exec();
  }

  // Returns a single Object document by id
  async findOne(id: string): Promise<ObjectDoc | null> {
    return this.objectModel.findById(id).exec();
  }

  // Removes a single Object document by id
  async remove(id: string): Promise<ObjectDoc | null> {
    return this.objectModel.findByIdAndDelete(id).exec();
  }
}
