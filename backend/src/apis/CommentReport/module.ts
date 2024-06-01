import { Module } from "@nestjs/common";
import { CommentReportController } from "./controller";
import { CommentReportService } from "./service";

@Module({
  controllers: [CommentReportController],
  providers: [CommentReportService],
})
export class CommentReportModule {}
