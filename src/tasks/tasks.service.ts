import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { Task } from '../entities/task.entity';
import { v4 } from 'uuid';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClassDto } from './dto/tasks.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class TasksService {
    constructor(
        @Inject('TASK_REPOSITORY')
        private _taskRespository: Repository<Task>
    ) { }

    async findById(id: string, user: User) {
        const found = await this._taskRespository.findOne({ where: { _id: id, user } })
        if (!found) {
            throw new NotFoundException();
        };

        return found;
    };

    async createTask(createTask: CreateClassDto, user: User): Promise<Task> {
        const { title, description } = createTask;
        const task = this._taskRespository.create({
            title,
            description,
            status: TaskStatus.PENDING,
            user
        });

        await this._taskRespository.save(task);

        return task;
    };

    async deleteTaskById(id: string, user: User): Promise<string> {
        const removed = await this._taskRespository.delete({_id: id, user: user});
        if (removed.affected === 0) {
            throw new NotFoundException();
        };
        return "OK";
    };

    async findAll(filters: GetTasksFilterDto, user: User): Promise<Task[]> {
        const query = this._taskRespository.createQueryBuilder('task');
        query.where({ user });

        if (filters?.status) {
            query.andWhere('task.status = :status', { status: filters.status });
        };

        if (filters?.search) {
            //Los LOWER en la query son para pasar tanto la columna como el termino que se busca a lowerCase
            query.andWhere('(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
                { search: `%${filters.search}%` }
            )
        }

        const tasks = await query.getMany();
        if(!tasks || tasks.length === 0) {
            throw new NotFoundException();
        };
        return tasks;
    };

    async updateStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.findById(id, user);
        task.status = status;

        return this._taskRespository.save(task);

    };
}
