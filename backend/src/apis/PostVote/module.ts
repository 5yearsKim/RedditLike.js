import { Module } from "@nestjs/common";
import { PostVoteController } from "./controller";
import { PostVoteService } from "./service";
import { PostService } from "../Post/service";


@Module({
  controllers: [PostVoteController],
  providers: [PostVoteService, PostService],
})
export class PostVoteModule {}
