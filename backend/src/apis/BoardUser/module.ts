import { Module } from "@nestjs/common";
import { BoardUserController } from "./controller";
import { BoardUserService } from "./service";

@Module({
  controllers: [BoardUserController],
  providers: [BoardUserService],
})
export class BoardUserModule {}
