import { Module } from "@nestjs/common";
import { GroupController } from "./controller";
import { GroupService } from "./service";

@Module({
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
