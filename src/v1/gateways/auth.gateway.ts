import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common'
import { Server, Socket } from 'socket.io';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
} from 'class-validator';
var bcrypt = require('bcryptjs')

import { Employee } from '@models/v1/employees.model'

class LoginFormDTO {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword({
    minLength: 12,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  })
  password: string;

  salt: string;
}

@WebSocketGateway(8000, { 
  namespace: 'auth', 
  cors: {
    origin: '*'
  }
})
export class AuthGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(AuthGateway.name);

  @WebSocketServer()
  server: Server;
  /**
   *  email: daonhu14122000@gmail.com
   *  password: Daonhu14122000!@
   *  salt: '$2a$16$ZML5CXqzXEbkmwBTeirpT.'
   */

  @SubscribeMessage("form_process")
  async onProcessingForm(
    @ConnectedSocket() client: Socket, 
    @MessageBody() form: LoginFormDTO
  ) {
    let isMatchEmail = bcrypt.compareSync(form.email, bcrypt.hashSync(form.email, form.salt))
    let isMatchPassword = bcrypt.compareSync(form.password, bcrypt.hashSync(form.password, form.salt))

    if (isMatchEmail && isMatchPassword) {
      let user = JSON.parse(JSON.stringify(await Employee.findOne({
        where: {
          email: bcrypt.hashSync(form.email, form.salt),
          password: bcrypt.hashSync(form.password, form.salt),
          salt: form.salt
        }
      })))
      user && client.emit('get_me', user)
    }
  }
  

  @SubscribeMessage("ping")
  handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data: string,) {
    this.logger.log(`Message received from client id: ${socket.id}`);
    this.logger.debug(data);
    return {
      event: "pong",
      data: "Wrong data that will make the test fail",
    };
  }

  afterInit(server: any) {
    this.logger.log("Initialized");
  }

  handleConnection(client: any, ...args: any[]) {
    const { sockets } = this.server.sockets;

    this.logger.log(`Client id: ${client.id} connected`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Cliend id:${client.id} disconnected`);
  }

}