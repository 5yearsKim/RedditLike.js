import { Injectable } from "@nestjs/common";
import { userM } from "@/models/User";
import { emailVerificationM } from "@/models/EmailVerification";
import * as err from "@/errors";
import { env } from "@/env";
import * as jwt from "jsonwebtoken";
import { genUniqueId } from "@/utils/random";
import { addDays } from "date-fns";
import axios from "axios";
import type { UserFormT, UserT, UserSessionT } from "@/types";


@Injectable()
export class AuthService {

  private async findOrCreateUser(email: string): Promise<UserT> {
    const fetched = await userM.findOne({ email });
    // if not exist, create account
    if (!fetched) {
      const sub = `user_${genUniqueId({ len: 8 })}`;
      const form: UserFormT = {
        sub,
        email,
      };
      const created = await userM.create(form);
      if (!created) {
        throw new err.NotAppliedE("not created");
      }
      return created;
    }
    // if exist, login
    else {
      return fetched;
    }
  }

  private generateLoginSession(user: UserT): UserSessionT{
    const expiresAt = addDays(new Date(), 90);
    const payload = {
      iat: new Date().getTime(),
      exp: expiresAt.getTime() / 1000,
      iss: "onioncontents",
      user: {
        id: user.id,
        sub: user.sub,
        email: user.email,
      },
    };
    const userToken = jwt.sign(payload, env.USER_SECRET);
    const session: UserSessionT = {
      user,
      token: userToken,
      tokenExpAt: expiresAt.getTime() / 1000,
    };
    return session;
  }

  async verifyGoogleLogin(token: string): Promise<UserSessionT> {
    try {
      const rsp: {
        sub: string,
        email: string,
        email_verified: boolean,
        name: string,
        picture: string,
        locale: string,
      } = (await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`)).data;

      const account = await this.findOrCreateUser(rsp.email);
      const session = this.generateLoginSession(account);

      return session;
    } catch (e) {
      console.warn(e);
      throw new err.ForbiddenE("invalid token");
    }
  }

  async verifyEmailLogin(email: string, code: string): Promise<UserSessionT> {
    const fetched = await emailVerificationM.find({
      builder: (qb) => {
        qb.where({ email: email, is_verified: false }).orderBy("id", "desc").limit(1);
      }
    });
    if (!fetched) {
      throw new err.ForbiddenE("VERIFICATION_NOT_EXIST: verification not exists");
    }
    const [last] = fetched;
    if (last.trial > 5) {
      throw new err.ForbiddenE("TRIAL_OVER: too many trials.. try again");
    }
    if (last.code !== code) {
      await emailVerificationM.updateOne({ id: last.id }, { trial: last.trial + 1 });
      throw new err.ForbiddenE("INVALID_CODE: verification code not matching");
    }
    await emailVerificationM.updateOne({ id: last.id }, { is_verified: true });

    // find or create account
    const user = await this.findOrCreateUser(email);
    const session = this.generateLoginSession(user);

    return session;
  }

  async verifyFakeLogin(email: string): Promise<UserSessionT> {
    // find or create account
    const user = await this.findOrCreateUser(email);
    const session = this.generateLoginSession(user);

    return session;
  }

  async refresh(user: UserT): Promise<UserSessionT> {
    const found = await userM.findById(user.id);
    if (!found) {
      throw new err.NotExistE("not exist");
    }
    const session = this.generateLoginSession(found);
    return session;
  }

}
