import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { env } from "@/env";
import * as jwt from "jsonwebtoken";
import * as err from "@/errors";


@Injectable() // Injectable - nestJS
export class DecodeAccount implements NestMiddleware<Request, Response> {
  constructor() { }

  async use(req: Request, res: Response, next: NextFunction) {

    let accountToken = req.headers["x-account-token"];
    if (!accountToken || typeof accountToken !== "string") {
      return next();
    }
    if (accountToken.startsWith("Bearer ")) {
      accountToken = accountToken.slice(7, accountToken.length); // Bearer 뒤에 있는 토큰을 가져온다.
    }
    try {
      const decoded = jwt.verify(accountToken, env.ACCOUNT_SECRET);
      (req as any)["accountId"] = (decoded as {account: {id: idT, email: string, sub: string}}).account.id;
      // if (ok) req["memberInfo"] = memberInfo;
      return next();
    } catch (e) {
      throw new err.UnauthorizedE("invalid account token");
    }
  }
}
