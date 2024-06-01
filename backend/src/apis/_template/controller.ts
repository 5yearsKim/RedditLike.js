import { Controller, Post, Body, Param, Query } from "@nestjs/common";
import { _Service } from "./service";


@Controller("_")
export class _Controller {
  constructor(private readonly service: _Service) {}


}