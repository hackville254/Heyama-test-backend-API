import { Body, Controller, Delete, Get, Param, Post, NotFoundException } from '@nestjs/common';
import { ObjectsService } from './objects.service';
import { CreateObjectDto } from './dto/create-object.dto';
import { S3Service } from '../s3/s3.service';

// Controller exposing REST endpoints for managing Objects
@Controller('objects')
export class ObjectsController {
  constructor(
    private readonly objectsService: ObjectsService,
    private readonly s3Service: S3Service,
  ) {}

  // Creates a new Object using the provided title, description and imageUrl
  @Post()
  async create(@Body() dto: CreateObjectDto) {
    const created = await this.objectsService.create(dto);
    return created;
  }

  // Returns an array of all Objects
  @Get()
  async findAll() {
    return this.objectsService.findAll();
  }

  // Returns a single Object by its id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const doc = await this.objectsService.findOne(id);
    if (!doc) throw new NotFoundException('Object not found');
    return doc;
  }

  // Removes an Object from MongoDB and deletes its image from S3
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const removed = await this.objectsService.remove(id);
    if (!removed) throw new NotFoundException('Object not found');
    if (removed.imageUrl) {
      const key = this.s3Service.keyFromUrl(removed.imageUrl);
      await this.s3Service.deleteByKey(key);
    }
    return removed;
  }

  // Generates a presigned URL to upload an image directly to S3
  @Post('upload-url')
  async uploadUrl(
    @Body()
    body: {
      filename: string;
      contentType: string;
    },
  ) {
    const sanitizedName = body.filename.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const timestamp = Date.now();
    const key = `objects/${timestamp}-${sanitizedName}`;
    const result = await this.s3Service.generateUploadUrl({
      key,
      contentType: body.contentType,
    });
    return result;
  }
}
