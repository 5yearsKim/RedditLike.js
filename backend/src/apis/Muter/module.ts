import { Module } from "@nestjs/common";
import { MuterController } from "./controller";
import { MuterService } from "./service";

@Module({
  controllers: [MuterController],
  providers: [MuterService],
})
export class MuterModule {}
