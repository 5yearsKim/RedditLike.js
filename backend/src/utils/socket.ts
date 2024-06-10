import axios from "axios";
import { SOCKET_PORT } from "@/env";

export async function forwardSocketEvent(event: ForwardEventT): Promise<void> {
  try {
    await axios.post(`http://localhost:${SOCKET_PORT}/event`, event, {
      timeout: 1000,
    });
  } catch (e) {
    console.warn(e);
  }
}