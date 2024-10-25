import { IsEnum, IsNotEmpty } from "class-validator";
import { TaskStatus } from "../task-status.enum";

export class UpdateTaskStatusDto {
    @IsEnum(TaskStatus)
    @IsNotEmpty()
    status: TaskStatus;
};