import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './dto/task.entity';

@Injectable()
export class TasksService {
    constructor(@InjectRepository(TasksRepository) private tasksRepository: TasksRepository) { }

    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
        const { status, search } = filterDto;

        let tasks = this.getAllTasks();

        if (status) {
            tasks = tasks.filter((task) => task.status === status)
        }
        if (search) {
            tasks = tasks.filter((task) => {
                // .toLocaleLowerCase() is used for english can be remove for persian
                if (task.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()) || task.description.toLocaleLowerCase().includes(search.toLocaleLowerCase())) {
                    return true;
                }
                return false;
            })
        }

        return tasks;
    }

    getTaskById(id: string): Promise<Task> {
        return this.tasksRepository.getTaskById(id);
    }

    createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksRepository.createTask(createTaskDto);
    }

    deleteTask(id: string): Promise<void> {
        return this.tasksRepository.deleteTask(id);
    }

    updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
        return this.tasksRepository.updateTaskStatus(id, status);
    }
}
