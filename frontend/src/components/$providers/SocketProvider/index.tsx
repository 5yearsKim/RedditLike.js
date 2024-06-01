"use client";
import { useEffect, useState } from "react";
import { socket } from "@/system/socket";
import { useMe } from "@/stores/UserStore";
import { userTH } from "@/system/token_holders";
import { useChatSocketListener } from "@/sockets/chat";
import { useNotificationSocketListener } from "@/sockets/notification";

export function SocketProvider({ children }: { children: JSX.Element }): JSX.Element {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const me = useMe();

  // connect and disconnect
  useEffect(() => {
    if (me) {
      socket.io.opts.query!.authToken = userTH.get()?.token;
      socket.connect();
      console.log("socket connected!");
      return () => {
        socket.disconnect();
      };
    }
  }, [me]);

  // socket listen
  useEffect(() => {
    function onConnected(): void {
      setIsConnected(true);
    }

    function onDisconnected(): void {
      setIsConnected(false);
    }

    socket.on("connect", onConnected);
    socket.on("disconnect", onDisconnected);

    return () => {
      socket.off("connect", onConnected);
      socket.off("disconnect", onDisconnected);
    };
  }, []);

  // listener register
  useChatSocketListener(isConnected);
  useNotificationSocketListener(isConnected);

  return children;
}
