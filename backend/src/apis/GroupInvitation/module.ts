import { Module } from "@nestjs/common";
import { GroupInvitationController } from "./controller";
import { GroupInvitationService } from "./service";

@Module({
  controllers: [GroupInvitationController],
  providers: [GroupInvitationService],
})
export class GroupInvitationModule {}
