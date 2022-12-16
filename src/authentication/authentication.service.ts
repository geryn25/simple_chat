import { BadRequestException, Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthenticationService {
    constructor(private readonly prismaService : PrismaService) {}

    async validateUser(username : string,password : string) : Promise<any> {
        try {
            const user = await this.prismaService.user.findFirstOrThrow({where : {username}})
            if (user.password == password) {
                const {password,...result} = user;
                return result;
            }
            throw Error()
            
        } catch (error) {
            throw new UnauthorizedException()
        }
    }
    async register(data : CreateUserDto) {
        try {
            return await this.prismaService.user.create({data});
        } catch (error) {
            throw new BadRequestException();
        }
    }
}
