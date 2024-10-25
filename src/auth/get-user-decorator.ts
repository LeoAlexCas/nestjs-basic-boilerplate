import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { User } from "src/entities/user.entity";

export const GetUSer = createParamDecorator((data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
})