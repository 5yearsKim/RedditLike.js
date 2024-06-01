import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { HandledError } from "@/errors";
import { HttpAdapterHost } from "@nestjs/core";
import { ZodValidationException } from "nestjs-zod";
import { DatabaseError } from "pg";
import { env } from "@/env";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(e: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const rsp = ctx.getResponse();

    if (env.STAGE == "dev") {
      console.log("exception_filter: ", e);
    }

    // const httpStatus =
    //   exception instanceof HttpError
    //     ? exception.status
    //     : HttpStatus.INTERNAL_SERVER_ERROR;
    if (e instanceof NotFoundException) {
      const status = e.getStatus();
      const responseBody = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        code: "NOT_FOUND",
        message: e.message,
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
      };

      httpAdapter.reply(rsp, responseBody, status);
    } else if (e instanceof BadRequestException) {
      const status = e.getStatus();
      const responseBody = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        code: "BAD_REQUEST",
        message: e.message,
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
      };

      httpAdapter.reply(rsp, responseBody, status);
    } else if (e instanceof HandledError) {
      const status = e.status;
      const responseBody = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        code: e.code,
        message: e.message,
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
      };

      httpAdapter.reply(rsp, responseBody, status);
    } else if (e instanceof ZodValidationException ) {
      const status = 400;
      const responseBody = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        code: "INVALID_FIELD",
        message: e.getZodError().issues,
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
      };

      httpAdapter.reply(rsp, responseBody, status);
    } else if (e instanceof DatabaseError) {
      const status = 400;
      const responseBody = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        code: "DATABASE_ERROR",
        message: e.detail,
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
      };
      if (e.code == "23505") {
        responseBody.code = "ALREADY_EXIST";
      }
      httpAdapter.reply(rsp, responseBody, status);
    }
    else {
      const status = HttpStatus.INTERNAL_SERVER_ERROR;
      const responseBody = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        code: "SERVER_ERROR",
        message: "UNHANDLED ERROR",
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
      };

      httpAdapter.reply(rsp, responseBody, status);
    }

  }
}
