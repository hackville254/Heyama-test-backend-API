import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';

// Module that exposes the MongoDB connection provider to other modules
@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
