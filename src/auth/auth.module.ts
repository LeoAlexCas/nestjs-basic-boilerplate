import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DataBaseModule } from 'src/data-base/data-base.module';
import { authProvider } from './auth.providers';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports:[
    DataBaseModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async(configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: 3600
          }
        }
      }
    })
    // JwtModule.register({
    //   secret: 'secret!',
    //   signOptions: {
    //     expiresIn: 3600
    //   }
    // })
  ],
  controllers: [AuthController],
  providers: [AuthService, ...authProvider, JwtStrategy],
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}
