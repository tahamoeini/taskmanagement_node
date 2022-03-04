import { NotFoundException } from "@nestjs/common";
import { filter } from "rxjs";
import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { Task } from "./task.entity";
import { TaskStatus } from "./task-status.enum";
import { User } from "src/auth/user.entity";

@EntityRepository(Task)
export class TasksRepository extends Repository<Task>{
    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');
        query.where({ user });

        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        if (search) {
            query.andWhere('(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))', { search: `%${search}%` });
        }

        const tasks = await query.getMany();
        return tasks;
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = createTaskDto;

        const task = this.create({
            title,
            description,
            status: TaskStatus.OPEN,
            user: user,
        });

        await this.save(task);
        return task;
    }

    async getTaskById(id: string, user: User): Promise<Task> {
        const found = await this.findOne({ id, user });

        if (!found) {
            throw new NotFoundException(`No Task with this Task ID of ${id}, Khodafez!(Some Persian bye)`);
        }
        return found;
    }

    async deleteTask(id: string, user: User): Promise<void> {
        const result = await this.delete({ id, user });

        if (result.affected === 0) {
            throw new NotFoundException(`No Task with this Task ID of ${id}, Khodafez!(Some Persian bye)`);
        }
    }

    async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);
        task.status = status;
        await this.save(task);
        return task;
    }
}