import { Module } from "@nestjs/common";
import { PollController } from "./controller";
import { PollService } from "./service";

@Module({
  controllers: [PollController],
  providers: [PollService],
})
export class PollModule {}
