import { DataModel, SqlInjector } from "@/utils/orm";
import type { EmailVerificationFormT, EmailVerificationT } from "@/types/EmailVerification";


const table = "email_verifications";
export const emailVerificationM = new DataModel<EmailVerificationFormT, EmailVerificationT>(table);


export class EmailVerificationSqls extends SqlInjector {
  constructor() {
    super(table);
  }
}

