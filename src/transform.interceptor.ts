import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { classToPlain, instanceToPlain } from "class-transformer";
import { Observable, map } from "rxjs";

@Injectable()
export class TransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>) {
        return next.handle().pipe(map((data) => instanceToPlain(data)))
    }
}