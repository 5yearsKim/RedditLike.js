import { Module } from "@nestjs/common";
import { PostPinController } from "./controller";
import { PostPinService } from "./service";

@Module({
  controllers: [PostPinController],
  providers: [PostPinService],
})
export class PostPinModule {}
