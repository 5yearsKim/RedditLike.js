import { Module } from "@nestjs/common";
import { BoardUserBlockController } from "./controller";
import { BoardUserBlockService } from "./service";

@Module({
  controllers: [BoardUserBlockController],
  providers: [BoardUserBlockService],
})
export class BoardUserBlockModule {}
