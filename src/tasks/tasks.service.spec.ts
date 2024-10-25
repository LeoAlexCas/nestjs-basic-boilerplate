import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TasksService } from './tasks.service';
import { Task } from '../entities/task.entity';
import { User } from '../entities/user.entity';
import { TaskStatus } from './task-status.enum';

describe('TasksService', () => {
  let service: TasksService;
  let repository: Repository<Task>;

  const mockTaskRepository = {
    findOne: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: 'TASK_REPOSITORY',
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Task>>('TASK_REPOSITORY');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return "OK" if the task is successfully deleted', async () => {
    const mockUser = new User();
    mockTaskRepository.delete = jest.fn().mockResolvedValue({ affected: 1 });

    const result = await service.deleteTaskById('someId', mockUser);
    expect(result).toBe('OK');
  });

  it('should throw a NotFoundException if the task is not found', async () => {
    const mockUser = new User();
    mockTaskRepository.delete = jest.fn().mockResolvedValue({ affected: 0 });

    await expect(service.deleteTaskById('someId', mockUser)).rejects.toThrow(NotFoundException);
  });

  it('should return the task if found', async () => {
    const mockUser = new User();
    const mockTask = new Task();
    mockTaskRepository.findOne.mockResolvedValue(mockTask);

    const result = await service.findById('someId', mockUser);
    expect(result).toEqual(mockTask);
  });

  it('should throw a NotFoundException if task not found', async () => {
    const mockUser = new User();
    mockTaskRepository.findOne.mockResolvedValue(null);

    await expect(service.findById('someId', mockUser)).rejects.toThrow(NotFoundException);
  });

  it('should return an array of tasks based on filters', async () => {
    const mockUser = new User();
    const mockTasks = [new Task(), new Task()];
    const filters = { status: TaskStatus.PENDING, search: 'test' };

    const createQueryBuilder: any = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockTasks),
    };

    mockTaskRepository.createQueryBuilder = jest.fn(() => createQueryBuilder);

    const result = await service.findAll(filters, mockUser);
    expect(result).toEqual(mockTasks);
    expect(createQueryBuilder.where).toHaveBeenCalledWith({ user: mockUser });
    expect(createQueryBuilder.andWhere).toHaveBeenCalledWith('task.status = :status', { status: filters.status });
    expect(createQueryBuilder.andWhere).toHaveBeenCalledWith(
      '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
      { search: `%${filters.search}%` }
    );
  });

  it('should throw a NotFoundException if no tasks are found', async () => {
    const mockUser = new User();
    const filters = { status: TaskStatus.PENDING, search: 'test' };

    const createQueryBuilder: any = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    };

    mockTaskRepository.createQueryBuilder = jest.fn(() => createQueryBuilder);

    await expect(service.findAll(filters, mockUser)).rejects.toThrow(NotFoundException);
  });

});

