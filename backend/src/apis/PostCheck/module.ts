import { Module } from "@nestjs/common";
import { PostCheckController } from "./controller";
import { PostCheckService } from "./service";

@Module({
  controllers: [PostCheckController],
  providers: [PostCheckService],
})
export class PostCheckModule {}
