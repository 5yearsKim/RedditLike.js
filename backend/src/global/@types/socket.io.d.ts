import { Socket as Socket_ } from "socket.io";

declare module "socket.io" {
  interface Socket extends Socket_ {
    userId?: idT;
    // other additional attributes here, example:
    // surname?: string;
  }
}

