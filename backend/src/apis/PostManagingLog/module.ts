import { Module } from "@nestjs/common";
import { PostManagingLogController } from "./controller";
import { PostManagingLogService } from "./service";

@Module({
  controllers: [PostManagingLogController],
  providers: [PostManagingLogService],
})
export class PostManagingLogModule {}
