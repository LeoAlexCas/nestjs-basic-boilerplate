import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialesDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private _authService: AuthService
    ) {};

    @Post()
    createUser(@Body() body: AuthCredentialesDto): Promise<void> {
        return this._authService.createUser(body)
    };

    @Post('/signin')
    signIn(@Body() authCredentialesDto: AuthCredentialesDto): Promise<any> {
        return this._authService.signIn(authCredentialesDto);
    };
};
