import { Controller, Post, Body } from "@nestjs/common";
import { UrlInfoService } from "./service";
import { InspectUrlDto } from "./dtos";
import type * as R from "@/types/UrlInfo.api";


@Controller("url-infos")
export class UrlInfoController {
  constructor(private readonly service: UrlInfoService) {}

  @Post("/inspect")
  async inspect(@Body() body: InspectUrlDto): Promise<R.InspectRsp> {
    const { url } = body satisfies R.InspectRqs;
    const result = await this.service.inspect(url);
    return result;
  }
}