import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { ConversationModule } from './conversation/conversation.module';
import { PrismaModule } from './prisma/prisma.module';
import { ChatModule } from './chat/chat.module';
import { AppGateway } from './app/app.gateway';
import { ConversationService } from './conversation/conversation.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [AuthenticationModule, ConversationModule, PrismaModule, ChatModule],
  controllers: [AppController],
  providers: [AppService, AppGateway, ConversationService, JwtService],
})
export class AppModule {}
