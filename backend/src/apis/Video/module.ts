import { Module } from "@nestjs/common";
import { VideoController } from "./controller";
import { VideoService } from "./service";

@Module({
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {}
