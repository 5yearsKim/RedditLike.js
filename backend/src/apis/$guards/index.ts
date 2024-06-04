import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import * as err from "@/errors";
import { env } from "@/env";
export * from "./check_manager";
export * from "./check_admin";

@Injectable()
export class SystemGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const isSystem = request.headers["x-system-secret"] == env.SYSTEM_SECRET;
    if (isSystem == false) {
      throw new err.ForbiddenE("invalid system secret");
    }
    return true;
  }
}


@Injectable()
export class UserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      throw new err.UnauthorizedE("no user credential found");
    }
    return true;
  }
}

