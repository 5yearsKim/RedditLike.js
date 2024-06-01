import { Module } from "@nestjs/common";
import { FlairController } from "./controller";
import { FlairService } from "./service";
import { FlairBoxService } from "../FlairBox/service";

@Module({
  controllers: [FlairController],
  providers: [FlairService, FlairBoxService],
})
export class FlairModule {}
