import { Module } from '@nestjs/common';
import { ObjectsController } from './objects.controller';
import { ObjectsService } from './objects.service';
import { S3Service } from '../s3/s3.service';
import { DatabaseModule } from '../database/database.module';
import { objectsProviders } from './objects.providers'; // manual model providers via objectsProviders

// Module bundling Object-related components (providers, service, controller)
@Module({
  imports: [DatabaseModule], // using DatabaseModule with manual model providers
  controllers: [ObjectsController],
  providers: [ObjectsService, S3Service, ...objectsProviders], // objectsProviders supply models
})
export class ObjectsModule {}
