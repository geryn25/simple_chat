import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthenticationService } from "../authentication.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService : AuthenticationService) {
        super()
    }

    async validate(username: string, password : string): Promise<any> {
    try {
        const user = await this.authService.validateUser(username, password)
        return user;
    } catch (error) {
        throw new UnauthorizedException()
    }        

    }
}