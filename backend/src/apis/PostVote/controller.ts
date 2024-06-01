import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { User } from "@/apis/$decorators";
import { UserGuard } from "@/apis/$guards";
import { PostVoteService } from "./service";
import {
  ScorePostVoteDto,
} from "./dtos";
import { PostService } from "../Post/service";
import type { UserT } from "@/types";
import * as R from "@/types/PostVote.api";


@Controller("post-votes")
export class PostVoteController {
  constructor(
    private readonly service: PostVoteService,
    private readonly postService: PostService,
  ) {}

  @UseGuards(UserGuard)
  @Post("/score")
  async score(
    @User() user: UserT,
    @Body() body: ScorePostVoteDto,
  ): Promise<R.ScoreRsp> {
    const { postId, score } = body satisfies R.ScoreRqs;
    const vote = await this.service.score(user.id, postId, score);

    this.postService.updateAggr(postId, { voteInfo: true, hotScore: true })
      .catch((err) => console.log("post-votes/score err:", err));
    return vote;
  }

}