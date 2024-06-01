import { Module } from "@nestjs/common";
import { CommentController } from "./controller";
import { CommentService } from "./service";
import { CommentManagingLogService } from "@/apis/CommentManagingLog/service";
import { PostService } from "@/apis/Post/service";

@Module({
  controllers: [CommentController],
  providers: [CommentService, CommentManagingLogService, PostService],
})
export class CommentModule {}
