import { EntityRepository, Repository } from "typeorm";
import { Task } from "./dto/task.entity";

@EntityRepository(Task)
export class TasksRepository extends Repository<Task>{

}