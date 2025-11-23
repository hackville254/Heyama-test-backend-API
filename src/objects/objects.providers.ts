import { Connection } from 'mongoose';
import { ObjectSchema } from './schemas/object.schema';

// Manual model provider that registers the Object model on the active connection
export const objectsProviders = [
  {
    provide: 'OBJECT_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Object', ObjectSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
