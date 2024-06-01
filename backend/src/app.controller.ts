import { Controller, Get, Req, Res } from "@nestjs/common";
import { Response, Request } from "express";
import { AccountId } from "@/apis/$decorators";

import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/")
  getHello(@AccountId() accountId: idT, @Req() req: Request): string {
    return this.appService.getHello();
  }
}
