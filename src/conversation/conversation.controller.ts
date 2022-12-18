import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';

@UseGuards(JwtAuthGuard)
@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  // @Post()
  // create(@Body() createConversationDto: CreateConversationDto) {
  //   return this.conversationService.create(createConversationDto);
  // }

  @Get()
  findAll(@Request() req) {
    return this.conversationService.findAllConversation(req.user);
  }
  @Post(':id/reply')
  createReply(@Param('id') id: string, @Request() req,@Body() body) {
    return this.conversationService.createReply(+id, body, req.user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const messages = await this.conversationService.findOne(+id, req.user);
    if (messages.length != 0) {
      await this.conversationService.readChat(+id,req.user);
    }
    return messages
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateConversationDto: UpdateConversationDto) {
  //   return this.conversationService.update(+id, updateConversationDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.conversationService.remove(+id);
  // }
}
