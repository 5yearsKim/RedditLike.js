import { Module } from "@nestjs/common";
import { PollVoteController } from "./controller";
import { PollVoteService } from "./service";

@Module({
  controllers: [PollVoteController],
  providers: [PollVoteService],
})
export class PollVoteModule {}
