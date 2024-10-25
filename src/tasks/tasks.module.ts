import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { taskProviders } from './tasks.providers';
import { DataBaseModule } from 'src/data-base/data-base.module';
import { TasksService } from './tasks.service';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [DataBaseModule, AuthModule, ConfigModule],
    controllers: [TasksController],
    providers: [
        TasksService,
        ...taskProviders
    ]
})
export class TasksModule {}
