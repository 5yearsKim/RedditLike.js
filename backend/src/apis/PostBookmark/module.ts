import { Module } from "@nestjs/common";
import { PostBookmarkController } from "./controller";
import { PostBookmarkService } from "./service";

@Module({
  controllers: [PostBookmarkController],
  providers: [PostBookmarkService],
})
export class PostBookmarkModule {}
