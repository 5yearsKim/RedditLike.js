import {
  Controller, Post,
  Body,
  UseGuards,
} from "@nestjs/common";
import { CommentVoteService } from "./service";
import { CommentService } from "../Comment/service";
import { User } from "@/apis/$decorators";
import { UserGuard } from "@/apis/$guards";
import {
  ScoreCommentVoteDto
} from "./dtos";
import type * as R from "@/types/CommentVote.api";
import type { UserT } from "@/types/User";


@Controller("comment-votes")
export class CommentVoteController {
  constructor(
    private readonly service: CommentVoteService,
    private readonly commentService: CommentService,
  ) {}

  @UseGuards(UserGuard)
  @Post("/score")
  async score(@User() user: UserT, @Body() body: ScoreCommentVoteDto): Promise<R.ScoreRsp> {
    const { commentId, score } = body satisfies R.ScoreRqs;
    const result = await this.service.score(user.id, commentId, score);

    this.commentService.updateAggr(commentId, { voteInfo: true })
      .catch((err) => console.log("comment-votes/score", err));

    return result;
  }
}