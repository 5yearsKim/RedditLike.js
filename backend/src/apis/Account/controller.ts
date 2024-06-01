import {
  Controller, Get, Post,
  Body, Query,
} from "@nestjs/common";
import { AccountService } from "./service";
import {
  CreateAccountDto,
  ListAccountDto,
} from "./dtos";
import type * as R from "@/types/Account.api";
import * as err from "@/errors";

@Controller("accounts")
export class AccountController {
  constructor(private readonly service: AccountService ) {}

  @Post("/")
  async create(@Body() body: CreateAccountDto): Promise<R.CreateRsp> {
    const { form } = body satisfies R.CreateRqs;
    const created = await this.service.create(form);
    return created;
  }

  @Get("/")
  async list(@Query() listOpt: ListAccountDto): Promise<R.ListRsp>{
    listOpt satisfies R.ListRqs;
    const fetched = await this.service.list();

    return { data: fetched, nextCursor: null };
  }
}

