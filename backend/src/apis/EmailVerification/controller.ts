import { Controller, Post, Body } from "@nestjs/common";
import { EmailVerificationService } from "./service";
import {
  RequestEmailVerificationDto,
  // VerifyEmailVerificationDto,
} from "./dtos";
import type * as R from "@/types/EmailVerification.api";


@Controller("email-verifications")
export class EmailVerificationController {
  constructor(private readonly service: EmailVerificationService) {}

  @Post("/request")
  async create(
    @Body() body: RequestEmailVerificationDto,
  ): Promise<R.RequestRsp> {
    const { email, emailOpt } = body satisfies R.RequestRqs;
    const isSuccess = await this.service.request(email, emailOpt);
    return isSuccess;
  }

}