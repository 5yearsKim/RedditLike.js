import { io } from "socket.io-client";
import { env } from "@/env";

export const socket = io(env.SOCKET_URL, {
  autoConnect: false,
  query: { authToken: "" },
});
