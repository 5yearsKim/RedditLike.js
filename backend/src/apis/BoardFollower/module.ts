import { Module } from "@nestjs/common";
import { BoardFollowerController } from "./controller";
import { BoardFollowerService } from "./service";
import { BoardService } from "@/apis/Board/service";

@Module({
  controllers: [BoardFollowerController],
  providers: [BoardFollowerService, BoardService],
})
export class BoardFollowerModule {}
