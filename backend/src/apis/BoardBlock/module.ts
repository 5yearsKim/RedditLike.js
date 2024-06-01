import { Module } from "@nestjs/common";
import { BoardBlockController } from "./controller";
import { BoardBlockService } from "./service";

@Module({
  controllers: [BoardBlockController],
  providers: [BoardBlockService],
})
export class BoardBlockModule {}
