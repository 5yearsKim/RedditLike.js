import {
  Controller, Post,
  Body,
  UseGuards,
} from "@nestjs/common";
import { UserGuard } from "@/apis/$guards";
import { User } from "@/apis/$decorators";
import {
  VotePollDto,
} from "./dtos";
import { PollVoteService } from "./service";
import type * as R from "@/types/PollVote.api";
import type { UserT } from "@/types";


@Controller("poll-votes")
export class PollVoteController {
  constructor(private readonly service: PollVoteService) {}

  @UseGuards(UserGuard)
  @Post("/vote")
  async vote(
    @User() user: UserT,
    @Body() body: VotePollDto,
  ): Promise<R.VoteRsp> {
    const { pollId, candIds } = body;
    await this.service.vote(pollId, user.id, candIds);
    return null;
  }

}