import { NotFoundException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { Task } from "./dto/task.entity";
import { TaskStatus } from "./task-status.enum";

@EntityRepository(Task)
export class TasksRepository extends Repository<Task>{
    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto;

        const task = this.create({
            title,
            description,
            status: TaskStatus.OPEN,
        });

        await this.save(task);
        return task;
    }

    async getTaskById(id: string): Promise<Task> {
        const found = await this.findOne(id);

        if (!found) {
            throw new NotFoundException(`No Task with this Task ID of ${id}, Khodafez!(Some Persian bye)`);
        }
        return found;
    }

    async deleteTask(id: string): Promise<void> {
        const result = await this.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`No Task with this Task ID of ${id}, Khodafez!(Some Persian bye)`);
        }
    }

    async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = status;
        await this.save(task);
        return task;
    }
}