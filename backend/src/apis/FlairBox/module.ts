import { Module } from "@nestjs/common";
import { FlairBoxController } from "./controller";
import { FlairBoxService } from "./service";

@Module({
  controllers: [FlairBoxController],
  providers: [FlairBoxService],
})
export class FlairBoxModule {}
