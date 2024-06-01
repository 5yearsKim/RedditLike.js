import { Module } from "@nestjs/common";
import { CommentVoteController } from "./controller";
import { CommentService } from "../Comment/service";
import { CommentVoteService } from "./service";


@Module({
  controllers: [CommentVoteController],
  providers: [CommentVoteService, CommentService],
})
export class CommentVoteModule {}
