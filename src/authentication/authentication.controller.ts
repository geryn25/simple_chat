import { Controller, Post , Request} from '@nestjs/common';
import { Body, UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport/dist';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return req.user
  }

  @Post('register')
  async register(@Body() body : CreateUserDto) {
    return this.authenticationService.register(body);
  }
}
