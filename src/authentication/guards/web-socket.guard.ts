import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Observable } from 'rxjs';
import { Socket} from 'socket.io';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class WebSocketGuard implements CanActivate {
    constructor(private readonly jwtService : JwtService){}
    canActivate(context: any): boolean | Promise<boolean> | Observable<boolean> {
        // console.log(context.arsgs[0].payload);
        const bearer = context.args[0].handshake.headers['authorization'].split(' ')[1]
        const user = this.jwtService.decode(bearer);
        if (user) {
            context.args[0]['user'] = user;
            return true
        }
        return false

    }
}
