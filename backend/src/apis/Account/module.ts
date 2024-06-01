import { Module } from "@nestjs/common";
import { AccountService } from "./service";
import { AccountController } from "./controller";

@Module({
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}

