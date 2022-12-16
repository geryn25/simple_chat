import { BadRequestException, Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthenticationService {
    constructor(private readonly prismaService : PrismaService, private readonly jwtService : JwtService) {}

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
    async login(user : any) {
        console.log(user)
        const payload = {username : user.username, name : user.name}
        return {access_token : this.jwtService.sign(payload), expires_in : '3600s'}

    }
    async register(data : CreateUserDto) {
        try {
            return await this.prismaService.user.create({data});
        } catch (error) {
            throw new BadRequestException();
        }
    }
}
