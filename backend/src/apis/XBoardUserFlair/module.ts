import { Module } from "@nestjs/common";
import { XBoardUserFlairController } from "./controller";
import { XBoardUserFlairService } from "./service";
import { BoardUserService } from "../BoardUser/service";

@Module({
  controllers: [XBoardUserFlairController],
  providers: [XBoardUserFlairService, BoardUserService],
})
export class XBoardUserFlairModule {}
