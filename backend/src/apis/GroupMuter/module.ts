import { Module } from "@nestjs/common";
import { GroupMuterController } from "./controller";
import { GroupMuterService } from "./service";

@Module({
  controllers: [GroupMuterController],
  providers: [GroupMuterService],
})
export class GroupMuterModule {}
