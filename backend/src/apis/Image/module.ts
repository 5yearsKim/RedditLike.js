import { Module } from "@nestjs/common";
import { ImageController } from "./controller";
import { ImageService } from "./service";

@Module({
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
