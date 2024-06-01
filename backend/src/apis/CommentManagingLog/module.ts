import { Module } from "@nestjs/common";
import { CommentManagingLogController } from "./controller";
import { CommentManagingLogService } from "./service";

@Module({
  controllers: [CommentManagingLogController],
  providers: [CommentManagingLogService],
})
export class CommentManagingLogModule {}
