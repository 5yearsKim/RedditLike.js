import { Module } from "@nestjs/common";
import { UrlInfoController } from "./controller";
import { UrlInfoService } from "./service";

@Module({
  controllers: [UrlInfoController],
  providers: [UrlInfoService],
})
export class UrlInfoModule {}
