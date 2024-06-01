import { Injectable } from "@nestjs/common";
import { accountM } from "@/models/Account";
import { emailVerificationM } from "@/models/EmailVerification";
import * as err from "@/errors";
import { env } from "@/env";
import * as jwt from "jsonwebtoken";
import { genUniqueId } from "@/utils/random";
import { addDays } from "date-fns";
import axios from "axios";
import type { AccountFormT, AccountT, AccountSessionT } from "@/types";


@Injectable()
export class AuthService {

  private async findOrCreateAccount(email: string): Promise<AccountT> {
    const fetched = await accountM.findOne({ email });
    // if not exist, create account
    if (!fetched) {
      const sub = `user_${genUniqueId({ len: 8 })}`;
      const form: AccountFormT = {
        sub,
        email,
      };
      const created = await accountM.create(form);
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

  private generateLoginSession(account: AccountT): AccountSessionT {
    const expiresAt = addDays(new Date(), 90);
    const payload = {
      iat: new Date().getTime(),
      exp: expiresAt.getTime() / 1000,
      iss: "onioncontents",
      account: {
        id: account.id,
        sub: account.sub,
        email: account.email,
      },
    };
    const accessToken = jwt.sign(payload, env.ACCOUNT_SECRET);
    const session: AccountSessionT = {
      account,
      accessToken,
      accessTokenExpAt: expiresAt.getTime() / 1000,
    };
    return session;
  }

  async verifyGoogleLogin(token: string): Promise<AccountSessionT> {
    try {
      const rsp: {
        sub: string,
        email: string,
        email_verified: boolean,
        name: string,
        picture: string,
        locale: string,
      } = (await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`)).data;

      const account = await this.findOrCreateAccount(rsp.email);
      const session = this.generateLoginSession(account);

      return session;
    } catch (e) {
      console.warn(e);
      throw new err.ForbiddenE("invalid token");
    }
  }

  async verifyEmailLogin(email: string, code: string): Promise<AccountSessionT> {
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
    const account = await this.findOrCreateAccount(email);
    const session = this.generateLoginSession(account);

    return session;
  }

  async verifyFakeLogin(email: string): Promise<AccountSessionT> {
    // find or create account
    const account = await this.findOrCreateAccount(email);
    const session = this.generateLoginSession(account);

    return session;
  }

  async refresh(accountId: idT): Promise<AccountSessionT> {
    const account = await accountM.findById(accountId);
    if (!account) {
      throw new err.NotExistE("not exist");
    }
    const session = this.generateLoginSession(account);
    return session;
  }

  async verifyAccountToken(accountToken: string): Promise<AccountSessionT> {
    const decoded = jwt.verify(accountToken, env.ACCOUNT_SECRET);

    type DecodedT = {account: {id: idT, email: string, sub: string}};
    const account = await accountM.findOne({ email: (decoded as DecodedT).account.email });
    if (!account) {
      throw new err.NotExistE("not exist");
    }
    const session = this.generateLoginSession(account);
    return session;
  }

}
