import { ConflictException, Inject, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialesDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @Inject('USER_REPOSITORY')
        private _userRepository: Repository<User>,
        private _jwtService: JwtService
    ) {}

    async createUser(authCredentialesDto: AuthCredentialesDto): Promise<void> {
        const { userName, password } = authCredentialesDto;

        const salt = await bcrypt.genSalt();
        const hashedPass = await bcrypt.hash(password, salt);

        const newAuth = this._userRepository.create({
            username: userName,
            password: hashedPass
        });

        try {
            await this._userRepository.save(newAuth);
        } catch(error) {
            if(error.code === '23505') {
                throw new ConflictException('User exists');
            };
            throw new InternalServerErrorException();
        };
        
    };

    async signIn(authCredentialesDto: AuthCredentialesDto): Promise<{ accessToken: string }> {
        const { userName, password } = authCredentialesDto;
        const user = this._userRepository.findOne({ where: { username: userName }});

        if(user && (await bcrypt.compare(password, (await user).password))) {
            const payload: IJwtPayload = { username: userName };
            const accessToken = await this._jwtService.sign(payload);
            return { accessToken };
        } else {
            throw new UnauthorizedException();
        };

    };
}
