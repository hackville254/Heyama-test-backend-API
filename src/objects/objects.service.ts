import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { ObjectDoc } from './schemas/object.schema';
import { ObjectsGateway } from './objects.gateway';

// Service encapsulating business logic around Objects collection
@Injectable()
export class ObjectsService {
  constructor(
    @Inject('OBJECT_MODEL') private readonly objectModel: Model<ObjectDoc>,
    private readonly gateway: ObjectsGateway,
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
    const saved = await created.save();
    this.gateway.emitObjectCreated({
      id: saved._id.toString(),
      title: saved.title,
      description: saved.description,
      imageUrl: saved.imageUrl,
      createdAt: saved.createdAt,
    });
    return saved;
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
    const removed = await this.objectModel.findByIdAndDelete(id).exec();
    if (removed) {
      this.gateway.emitObjectDeleted(id);
    }
    return removed;
  }
}
