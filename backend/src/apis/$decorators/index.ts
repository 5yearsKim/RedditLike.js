import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { UserT } from "@/types/User";
import * as err from "@/errors";


export const AccountId = createParamDecorator(
  (option: unknown, ctx: ExecutionContext): idT|null => {
    const request = ctx.switchToHttp().getRequest();
    return request.accountId ?? null; // extract token from request
  },
);

type UserOptionT = {
  force?: boolean;
}

export const User = createParamDecorator(
  (option: UserOptionT, ctx: ExecutionContext): UserT|null => {
    const request = ctx.switchToHttp().getRequest();
    if (option?.force && !request.user) {
      throw new err.UnauthorizedE("invalid user token");
    }
    return request.user ?? null; // extract token from request
  },
);


