import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../entities/user.entity';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const req: unknown = ctx.switchToHttp().getRequest();

    return (req as { user: User }).user;
  },
);
