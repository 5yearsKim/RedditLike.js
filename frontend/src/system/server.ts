import axios from "axios";
import { env } from "@/env";
import { userTH } from "@/system/token_holders";

export type AxiosOptions = {
  headers?: { [key: string]: string };
};

const server = axios.create({
  baseURL: env.API_URL,
  timeout: 10000,
});

// current tokens
server.interceptors.request.use(
  async (req) => {
    const userToken = userTH.get();
    if (userToken) {
      (req.headers as any)["x-user-token"] = `Bearer ${userToken.token}`;
    }

    return req;
  },
  (err) => err,
);

export { server };
