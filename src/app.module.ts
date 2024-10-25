import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataBaseModule } from './data-base/data-base.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';

@Module({
  imports: [
    TasksModule,
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      //validation schema de joi que esta en config.schema.ts
      validationSchema: configValidationSchema
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      //Factory para generar las options del orm
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password:  configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
          synchronize: true
        }
      }
    }),
    DataBaseModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }


// @Module({
//   imports: [
//     TasksModule,
//     ConfigModule.forRoot({
//       envFilePath: [`.env.stage.${process.env.STAGE}`]
//     }),
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: 'localhost',
//       port: 5432,
//       username: 'postgres',
//       password: 'postgres',
//       database: 'task-managment',
//       autoLoadEntities: true, //Carga automatico las tablas con las entidaes nest
//       synchronize: true //maniene sincronizadas las entidades con la tabla
//     }),
//     DataBaseModule,
//     AuthModule
//   ],
//   controllers: [],
//   providers: [],
// })
// export class AppModule { }
