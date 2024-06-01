import { Injectable } from "@nestjs/common";
import { emailVerificationM } from "@/models/EmailVerification";
import { subMinutes } from "date-fns";
import { generateVerificationCode, sendVerificationEmail, EmailVerificationOptionT } from "@/utils/verification";
import * as err from "@/errors";
import type { EmailVerificationFormT, EmailVerificationT } from "@/types/EmailVerification";

@Injectable()
export class EmailVerificationService {
  async create(form: EmailVerificationFormT): Promise<EmailVerificationT> {
    const created = await emailVerificationM.create(form);
    if (!created) {
      throw new err.NotAppliedE("not created");
    }
    return created;
  }

  async request(email: string, opt: EmailVerificationOptionT = {} ): Promise<boolean> {
    const recentRequests = await emailVerificationM.find({
      builder: (qb) => {
        const startTs = subMinutes(new Date(), 5);
        qb.where("email", email).where("created_at", ">", startTs );
      }
    });

    if (recentRequests.length > 5) {
      throw new err.ForbiddenE(`requests for ${email} overwhelmed.. try after 5 mins`);
    }

    const form: EmailVerificationFormT = {
      email,
      code: generateVerificationCode(),
      is_verified: false,
      trial: 0,
    };
    const created = await this.create(form);

    if (!created) {
      throw new err.NotAppliedE("not created");
    }

    await sendVerificationEmail(created.email, created.code, opt);

    return true;
  }

}