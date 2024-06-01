import { Module } from "@nestjs/common";
import { PostReportController } from "./controller";
import { PostReportService } from "./service";

@Module({
  controllers: [PostReportController],
  providers: [PostReportService],
})
export class PostReportModule {}
