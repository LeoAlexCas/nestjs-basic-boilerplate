import { Body, Controller, Delete, Get, Head, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateClassDto } from './dto/tasks.dto';
import { Task } from '../entities/task.entity';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUSer } from 'src/auth/get-user-decorator';
import { User } from 'src/entities/user.entity';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    //Logger por defecto de nest
    private logger = new Logger('TaskController')
    constructor(
        private taskService: TasksService,
        private configService: ConfigService
    ) { }

    @Get('/:id')
    getTaskById(@Param('id') id: string, @GetUSer() user: User): Promise<Task> {
        return this.taskService.findById(id, user);
    };

    @Get()
    getAllTasks(@Query() filterDto: GetTasksFilterDto, @GetUSer() user: User): Promise<Task[]> {
        //Logger por defecto de nest
        this.logger.verbose(`Init get all tasks for ${user.username}, with filters: ${JSON.stringify(filterDto)}`);
        //configService loggeando un valor, solo prueba
        console.log(this.configService.get('TEST'));
        return this.taskService.findAll(filterDto, user);
    };

    @Post()
    //Handler level pipes, con @UsePipes()
    createTask(/* Parameter level pipes */@Body() newTask: CreateClassDto,
    @GetUSer() user: User
    ): Promise<Task> {
        return this.taskService.createTask(newTask, user);
    };

    @Delete('/:id')
    deleteTask(@Param('id') id: string, @GetUSer() user: User): Promise<string> {
        return this.taskService.deleteTaskById(id, user);
    };

    @Patch('/:id/status')
    updateTask(
        @Param('id') id: string,
        @Body() updateTaskStatusDto: UpdateTaskStatusDto,
        @GetUSer() user: User
    ): Promise<Task> {
        return this.taskService.updateStatus(id, updateTaskStatusDto.status, user);
    };



    // @Get()
    // getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
    //     if(Object.keys.length) {
    //         return this.taskService.getTasksWithFilter(filterDto);
    //     } else {
    //         return this.taskService.getAllTasks();
    //     };
    // };

    // @Get('/:id')
    // getTaskById(@Param("id") id: string) {
    //     return this.taskService.getTaskById(id);
    // };

    // //Los GlobalPipes se establecen a nivel de aplicacion, en el main.ts
    // @Post()
    // //Handler level pipes, con @UsePipes()
    // createTask(/* Parameter level pipes */@Body() newTask: CreateClassDto) {
    //     return this.taskService.createTask(newTask.title, newTask.description);
    // };

    // @Delete(':id')
    // deleteTask(@Param('id') id: string) {
    //     this.taskService.deleteTask(id);
    // };

    // @Patch('/:id/status')
    // updateTaskStatus(
    //     @Param('id') id: string,
    //     @Body() updateTaskStatusDto: UpdateTaskStatusDto
    // ): Task {
    //     const { status } = updateTaskStatusDto;
    //     return this.taskService.updateTaskStatus(status, id);
    // };
};
