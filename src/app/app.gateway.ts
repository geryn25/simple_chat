import { Req, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';
import { Chat } from '@prisma/client';
import { Socket,Server } from 'socket.io';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';
import { WebSocketGuard } from 'src/authentication/guards/web-socket.guard';
import { ConversationService } from 'src/conversation/conversation.service';
import { CreateReplyDto } from 'src/conversation/dto/create-reply.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})

export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, NestGateway
{
  constructor(private readonly conversationService : ConversationService,){}
  @WebSocketServer()
  server: Server;
  afterInit(server: any) {
    console.log(server)
    // throw new Error('Method not implemented.');
  }

  @UseGuards(WebSocketGuard)
  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Connected ${client.id}`);   
    // throw new Error('Method not implemented.');
  }
  handleDisconnect(client: any) {
    console.log(`Disconnected: ${client.id}`);
    // throw new Error('Method not implemented.');
  }
  @UseGuards(WebSocketGuard)
  @SubscribeMessage('enter-room')
  async handleMessage(client: Socket, payload: any): Promise<Chat[]> {
    // console.log(client['user'])
    console.log(payload)
    // console.log(client['handshake']);
    //get message
    const messages = await this.conversationService.findOne(payload.room_id,client['user'])

    //read all chat
    await this.conversationService.readChat(payload.room_id,client['user']);
    return messages
    
  }
  @UseGuards(WebSocketGuard)

  @SubscribeMessage('sendMessage')
  async replyMessage(client: Socket, payload: any): Promise<void> {
    // console.log(payload)
    const messages = await this.conversationService.createReply(payload.room_id,{content : payload.content},client['user'])
    this.server.emit('enter-room',{room_id : payload.room_id, messages})
    // return messages;
  }
}
