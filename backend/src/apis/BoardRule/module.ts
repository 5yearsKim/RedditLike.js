import { Module } from "@nestjs/common";
import { BoardRuleController } from "./controller";
import { BoardRuleService } from "./service";

@Module({
  controllers: [BoardRuleController],
  providers: [BoardRuleService],
})
export class BoardRuleModule {}
