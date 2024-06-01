import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { type UserT } from "@/types/User";
import { env } from "@/env";
import * as jwt from "jsonwebtoken";
import * as err from "@/errors";


@Injectable() // Injectable - nestJS
export class DecodeUser implements NestMiddleware<Request, Response> {
  constructor() { }

  async use(req: Request, res: Response, next: NextFunction) {

    let userToken = req.headers["x-user-token"];
    if (!userToken || typeof userToken !== "string") {
      return next();
    }
    if (userToken.startsWith("Bearer ")) {
      userToken = userToken.slice(7, userToken.length); // Bearer 뒤에 있는 토큰을 가져온다.
    }
    try {
      const decoded = jwt.verify(userToken, env.USER_SECRET);
      (req as any)["user"] = (decoded as {user: UserT} ).user;
      // if (ok) req["memberInfo"] = memberInfo;
      return next();
    } catch (e) {
      console.warn(e);
      throw new err.UnauthorizedE("invalid user token");
    }
  }
}

