import { Controller, UseGuards, Post, Body } from "@nestjs/common";
import { AuthService } from "./service";
import { AccountId } from "@/apis/$decorators";
import { AccountGuard, SystemGuard } from "@/apis/$guards";
import {
  GoogleLoginDto,
  EmailLoginDto,
  FakeLoginDto,
  VerifyAccountTokenDto,
} from "./dtos";
import { env } from "@/env";
import * as err from "@/errors";
import type * as R from "@/types/Auth.api";

@Controller("auth")
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post("/google-login")
  async googleLogin(@Body() body: GoogleLoginDto): Promise<R.GoogleLoginRsp> {
    const { googleAccessToken } = body satisfies R.GoogleLoginRqs;
    const session = await this.service.verifyGoogleLogin(googleAccessToken);
    return session;
  }

  @Post("/email-login")
  async emailLogin(@Body() body: EmailLoginDto): Promise<R.EmailLoginRsp> {
    const { email, code } = body satisfies R.EmailLoginRqs;
    const session = await this.service.verifyEmailLogin(email, code);
    return session;
  }

  @UseGuards(SystemGuard)
  @Post("/fake-login")
  async fakeLogin(@Body() body: FakeLoginDto): Promise<R.FakeLoginRsp> {
    const { email } = body satisfies R.FakeLoginRqs;
    if (env.STAGE !== "dev") {
      throw new err.ForbiddenE("fake-login only available in dev stage");
    }
    const session = await this.service.verifyFakeLogin(email);
    return session;
  }

  @UseGuards(AccountGuard)
  @Post("/refresh")
  async refresh(@AccountId() accountId: idT): Promise<R.RefreshRsp> {
    const session = await this.service.refresh(accountId);
    return session;
  }

  @Post("/verify-account-token")
  async verifyAccountToken(
    @Body() body: VerifyAccountTokenDto
  ): Promise<R.VerifyAccountTokenRsp> {
    const { accountToken } = body satisfies R.VerifyAccountTokenRqs;
    const session = await this.service.verifyAccountToken(accountToken);
    return session;
  }

}
