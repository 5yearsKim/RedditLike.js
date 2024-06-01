import { Module } from "@nestjs/common";
import { PollCandController } from "./controller";
import { PollCandService } from "./service";

@Module({
  controllers: [PollCandController],
  providers: [PollCandService],
})
export class PollCandModule {}
