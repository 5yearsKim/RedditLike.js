import { Module } from "@nestjs/common";
import { GroupAdminController } from "./controller";
import { GroupAdminService } from "./service";

@Module({
  controllers: [GroupAdminController],
  providers: [GroupAdminService],
})
export class GroupAdminModule {}
