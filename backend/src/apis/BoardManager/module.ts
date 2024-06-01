import { Module } from "@nestjs/common";
import { BoardManagerController } from "./controller";
import { BoardManagerService } from "./service";

@Module({
  controllers: [BoardManagerController],
  providers: [BoardManagerService],
})
export class BoardManagerModule {}
