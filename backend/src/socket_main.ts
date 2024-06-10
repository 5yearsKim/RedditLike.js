import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
// import { initializeApp, applicationDefault } from "firebase-admin/app";
import { env, SOCKET_PORT } from "@/env";
// import * as err from '@/errors';
import { io, server, app } from "@/sockets/global";
import { toRoomId } from "@/sockets/utils";
import { runChatSocket } from "@/sockets/chat";
import { onNotificationCreatedForwarded } from "@/sockets/notification";


// initializeApp({
//   credential: applicationDefault(),
// });

app.use(cors());
app.use(express.json());


app.route("/")
  .get(
    (req: Request, res: Response ): Response => {
      return res.send("socket healthy!");
    },
  );

// rest api get event
app.route("/event")
  .post(
    async (req: Request, res: Response ): Promise<Response> => {
      const body = req.body as ForwardEventT;
      try {
        if (body.name == "notification-created") {
          const event = body as NotificationCreatedEventT;
          onNotificationCreatedForwarded(event);
        }
        return res.send("success");
      } catch (e) {
        console.warn(e);
        return res.status(500).send(e);
      }
    },
  );


// middlewares
io.use(function(socket , next){
  try {
    const query = socket.handshake.query;
    if (env.STAGE == "dev" && query.fakeId) {
      console.log("fakeId taken");
      socket.userId = parseInt(query.fakeId as any);
      return next();
    }
    if (query && query.authToken){
      const decoded = jwt.verify(query.authToken.toString(), env.USER_SECRET ?? "");
      socket.userId = (decoded as any).user.id;
      return next();
    }
    throw new Error("authToken not provided");
  } catch (e) {
    console.warn(e);
    next(new Error("Authentication error:" + e));
  }
});


io.on("connection", (socket) => {

  if (socket.userId) {
    const room = toRoomId(socket.userId, "user");
    socket.join(room);
    socket.emit("joined", `joining room ${room}`);
  }

  runChatSocket(socket);
});

server.listen(SOCKET_PORT, () => {
  console.log("socket listening on " + SOCKET_PORT);
});


