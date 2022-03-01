import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { filter } from 'rxjs';

@Injectable()
export class TasksService {
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

    getTaskById(id: string): Task {
        const found = this.tasks.find((task) => task.id === id);

        if (!found) {
            throw new NotFoundException(`No Task with this Task ID of ${id}, Khodafez!(Some Persian bye)`);
        }
        return found;
    }

    createTask(createTaskDto: CreateTaskDto): Task {
        const { title, description } = createTaskDto;

        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN,
        };

        this.tasks.push(task);
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
