import { Module } from "@nestjs/common";
import { EmailVerificationController } from "./controller";
import { EmailVerificationService } from "./service";

@Module({
  controllers: [EmailVerificationController],
  providers: [EmailVerificationService],
})
export class EmailVerificationModule {}
