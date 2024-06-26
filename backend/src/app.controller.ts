import { Controller, Get, Req, Res } from "@nestjs/common";
import { Response, Request } from "express";

import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/")
  getHello(@Req() req: Request): string {
    return this.appService.getHello();
  }
}
