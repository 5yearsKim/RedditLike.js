import { Module } from "@nestjs/common";
import { XPostFlagController } from "./controller";
import { XPostFlagService } from "./service";

@Module({
  controllers: [XPostFlagController],
  providers: [XPostFlagService],
})
export class XPostFlagModule {}
