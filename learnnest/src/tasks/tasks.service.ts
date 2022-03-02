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

    async getTaskById(id: string): Promise<Task> {
        const found = await this.tasksRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`No Task with this Task ID of ${id}, Khodafez!(Some Persian bye)`);
        }
        return found;
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto;

        const task = this.tasksRepository.create({
            title,
            description,
            status: TaskStatus.OPEN,
        });

        await this.tasksRepository.save(task);
        return task;
    }

    deleteTask(id: string): void {
        const found = this.getTaskById(id);
        this.tasks = this.tasks.filter((task) => task.id !== id);
    }

    updateTaskStatus(id: string, status: TaskStatus) {
        const task = this.getTaskById(id);
        task.status = status;
        return task;
    }
}
