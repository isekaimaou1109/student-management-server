import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common'
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8000, { 
  namespace: 'qi', 
  cors: {
    origin: '*'
  }
})
export class QiGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(QiGateway.name);

  @WebSocketServer()
  server: Server;
  

  @SubscribeMessage("ping")
  handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data: string,) {
    this.logger.log(`Message received from client id: ${socket.id}`);
    this.logger.debug(data);
    return {
      event: "pong qi",
      data: "Wrong data that will make the test fail",
    };
  }

  afterInit(server: any) {
    this.logger.log("Initialized");
  }

  handleConnection(client: any, ...args: any[]) {
    const { sockets } = this.server.sockets;

    this.logger.log(`Client id from qi: ${client.id} connected`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Cliend id from qi:${client.id} disconnected`);
  }

}