import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "./auth.service";
import { Repository } from "typeorm";
import { User } from "src/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject('USER_REPOSITORY')
        private _userRepository: Repository<User>,
        private authService: AuthService,
        private _jwtService: JwtService,
        private configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get<string>('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    async validate(payload) {
        const { username } = payload;
        const user: User = await this._userRepository.findOne({ where: { username } });
        if(!user) {
            throw new UnauthorizedException()
        };

        return user;
    };
};