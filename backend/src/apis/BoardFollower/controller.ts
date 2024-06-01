import {
  Controller, Post,
  Body,
  UseGuards,
} from "@nestjs/common";
import { User } from "@/apis/$decorators";
import { UserGuard } from "@/apis/$guards";
import type { UserT } from "@/types/User";
import { BoardFollowerService } from "./service";
import { BoardService } from "@/apis/Board/service";
import {
  FollowDto,
  UnfollowDto,
} from "./dtos";
import type * as R from "@/types/BoardFollower.api";
// import * as err from "@/errors";


@Controller("board-followers")
export class BoardFollowerController {
  constructor(
    private readonly service: BoardFollowerService,
    private readonly boardService: BoardService,
  ) {}


  @UseGuards(UserGuard)
  @Post("/follow")
  async follow(
    @User() user: UserT,
    @Body() body: FollowDto,
  ): Promise<R.FollowRsp> {
    const { boardId } = body satisfies R.FollowRqs;
    const created = await this.service.create({
      user_id: user.id,
      board_id: boardId,
    });

    this.boardService.updateAggrs(created.board_id, { num_follower: true })
      .catch((e) => console.warn("board-followers/follow:", e));

    return created;
  }

  @UseGuards(UserGuard)
  @Post("/unfollow")
  async unfollow(
    @User() user: UserT,
    @Body() body: UnfollowDto,
  ): Promise<R.UnfollowRsp> {
    const { boardId } = body satisfies R.UnfollowRqs;
    const deleted = await this.service.unfollow(user.id, boardId);

    this.boardService.updateAggrs(deleted.board_id, { num_follower: true })
      .catch((e) => console.warn("board-followers/unfollow:", e));

    return deleted;
  }

  // @UseGuards(UserGuard)
  // @Delete("/:id")
  // async delete(
  //   @User() user: UserT,
  //   @Param("id", ParseIntPipe) id: number,
  // ): Promise<R.DeleteRsp> {
  //   const follower = await this.service.get(user.id);
  //   if (follower.user_id !== user.id) {
  //     throw new err.ForbiddenE("Invalid user");
  //   }
  //   const deleted = await this.service.delete(id);
  //   return deleted;
  // }

}