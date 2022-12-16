import { Controller, Get, Request } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { AppService } from './app.service';
import { JwtAuthGuard } from './authentication/guards/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getHello(@Request() req): string {
    console.log(req.user)
    return this.appService.getHello();
  }
}
