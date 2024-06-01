import { Module } from "@nestjs/common";
import { BoardMuterController } from "./controller";
import { BoardMuterService } from "./service";

@Module({
  controllers: [BoardMuterController],
  providers: [BoardMuterService],
})
export class BoardMuterModule {}
