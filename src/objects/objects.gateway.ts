import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, Ack } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'objects', cors: { origin: '*' } })
export class ObjectsGateway {
  @WebSocketServer() server!: Server;

  // Echo handler: replies with the same data (ack-based)
  @SubscribeMessage('objects.echo')
  handleEcho(@MessageBody() data: unknown, @Ack() ack: (resp: { status: string; data: unknown }) => void): void {
    ack({ status: 'received', data });
  }

  // Example: ask server time and respond synchronously
  @SubscribeMessage('objects.time')
  handleTime(@ConnectedSocket() client: Socket): void {
    client.emit('objects.time', { now: new Date().toISOString() });
  }

  emitObjectCreated(payload: { id: string; title: string; description: string; imageUrl: string; createdAt: Date }): void {
    this.server.emit('objects.created', payload);
  }

  emitObjectDeleted(id: string): void {
    this.server.emit('objects.deleted', { id });
  }
}