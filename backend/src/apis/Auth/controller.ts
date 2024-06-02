import { Controller, UseGuards, Post, Body } from "@nestjs/common";
import { AuthService } from "./service";
import { SystemGuard, UserGuard } from "@/apis/$guards";
import { User } from "@/apis/$decorators";
import {
  GoogleLoginDto,
  EmailLoginDto,
  FakeLoginDto,
  VerifyUserTokenDto,
} from "./dtos";
import { env } from "@/env";
import * as err from "@/errors";
import type * as R from "@/types/Auth.api";
import type { UserT } from "@/types";

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

  @UseGuards(UserGuard)
  @Post("/refresh")
  async refresh(@User() user: UserT): Promise<R.RefreshRsp> {
    const session = await this.service.refresh(user);
    return session;
  }

  @Post("/verify-user-token")
  async verifyUserToken(
    @Body() body: VerifyUserTokenDto
  ): Promise<R.VerifyUserTokenRsp> {
    const { userToken } = body satisfies R.VerifyUserTokenRqs;
    const session = await this.service.verifyUserToken(userToken);
    return session;
  }

}
