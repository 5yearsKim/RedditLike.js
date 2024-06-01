import { Module } from "@nestjs/common";
import { PostController } from "./controller";
import { PostService } from "./service";
import { PostManagingLogService } from "../PostManagingLog/service";
import { BoardService } from "../Board/service";


@Module({
  controllers: [PostController],
  providers: [PostService, PostManagingLogService, BoardService],
})
export class PostModule {}


import { postM } from "@/models/Post";
import { knex } from "@/global/db";

setInterval(async () => {
  try {
    const outdatedPosts = await postM.find({
      builder: (qb) => {
        qb.whereNotNull("reserved_at")
          .where("reserved_at", "<", "NOW()");
      }
    });
    if (outdatedPosts.length > 0) {
      await knex({ p: "posts" })
        .whereIn("p.id", outdatedPosts.map((item) => item.id))
        .update({ reserved_at: null, published_at: "NOW()" });
    }
  } catch (e) {
    console.warn("error updating post reservation: ", e);
  }
}, 100 * 1000); // every 100 seconds
