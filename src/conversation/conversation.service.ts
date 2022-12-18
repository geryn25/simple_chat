import { ForbiddenException, Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { use } from 'passport';
import { UserModel } from 'src/authentication/user.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';

@Injectable()
export class ConversationService {
  constructor(private readonly prismaService: PrismaService) {}
  async createReply(id, createReplyDto: CreateReplyDto, user: UserModel) {
    //get conversation or room
    try {
      const conversations = await this.prismaService.room.findFirstOrThrow({
        where: { participant: { has: user.username }, id },
      });
      //get other user
      const [otherUser] = conversations.participant.filter(
        (elem) => elem != user.username,
      );
      // console.log(otherUser);
      // console.log(id);
      //create reply
      const reply = await this.prismaService.chat.create({
        data: {
          sender: user.username,
          receiver: otherUser,
          content: createReplyDto.content,
          room_id: id,
        },
      });
      return reply;
    } catch (error) {
      console.log(error)
      throw new ForbiddenException();
    }
  }
  async readChat(id, user: UserModel) {
    try {
      const conversations = await this.prismaService.room.findFirstOrThrow({
        where: { participant: { has: user.username }, id },
      });
      const readChat = await this.prismaService.chat.updateMany({
        data: { read: true },
        where: {
          room_id: id,
          receiver: user.username,
        },
      });
      return true
    } catch (error) {
      throw new UnauthorizedException()
    }
  }

  findAll() {
    return `This action returns all conversation`;
  }

  async findOne(id: number, user: UserModel) {
    //check if user have access to room
    try {
      const rooms = await this.prismaService.room.findFirstOrThrow({
        where: { id, participant: { has: user.username } },
      });
      //get all message
      const messages = await this.prismaService.chat.findMany({
        where: { room_id: id },
        orderBy: { createdAt: 'desc' },
      });
      return messages;
    } catch (error) {
      throw new ForbiddenException();
    }
  }
  async findAllConversation(user: UserModel) {
    //find all conversation
    const conversations = await this.prismaService.room.findMany({
      where: { participant: { has: user.username } },
    });
    for (let i = 0; i < conversations.length; i++) {
      //get last message
      const lastMessage = await this.prismaService.chat.findFirst({
        select: { content: true },
        where: { room_id: conversations[i].id },
        orderBy: { createdAt: 'desc' },
      });

      //get basic info (NAME)
      const getOther = conversations[i].participant.filter(
        (elem) => elem != user.username,
      );
      const getInfo = await this.prismaService.user.findFirst({
        select: { username: true, name: true },
        where: { username: getOther[0] },
      });

      // get unread count
      const unreadCount = await this.prismaService.chat.count({
        where: { room_id: conversations[i].id, read: false, receiver : user.username },
      });
      delete conversations[i].participant
      conversations[i]['last_message'] = lastMessage.content;
      conversations[i]['unread_count'] = unreadCount;
      conversations[i]['name'] = getInfo.name;
    }
    return conversations;
  }

  update(id: number, updateConversationDto: UpdateConversationDto) {
    return `This action updates a #${id} conversation`;
  }

  remove(id: number) {
    return `This action removes a #${id} conversation`;
  }
}
