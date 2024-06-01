import { Module } from "@nestjs/common";
import { MediaController } from "./controller";

@Module({
  controllers: [MediaController],
})
export class MediaModule {}
