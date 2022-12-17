import { BadRequestException, Injectable } from '@nestjs/common';
import { UserModel } from 'src/authentication/user.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createChatDto: CreateChatDto, user: UserModel) {
    //check if receiver the same as user
    try {
      if (createChatDto.receiver == user.username) {
        throw Error('cannot send message to yourself');
      }
      //check if conversation exist
      let conversations = await this.prismaService.room.findFirst({
        where: {
          participant: { hasEvery: [user.username, createChatDto.receiver] },
        },
      });
      if (!conversations) {
        conversations = await this.prismaService.room.create({
          data: { participant: [user.username, createChatDto.receiver] },
        });
      }
      const postChat = await this.prismaService.chat.create({
        data: {
          sender: user.username,
          receiver : createChatDto.receiver,
          room_id: conversations.id,
          content: createChatDto.content,
        },
      });
      return postChat;
    } catch (error) {
      throw new BadRequestException()
    }
  }


  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
