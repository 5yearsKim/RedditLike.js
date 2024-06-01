import { Module } from "@nestjs/common";
import { BoardService } from "./service";
import { BoardManagerService } from "../BoardManager/service";
import { BoardController } from "./controller";

@Module({
  controllers: [BoardController],
  providers: [BoardService, BoardManagerService],
})
export class BoardModule {}


