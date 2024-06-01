import axios from "axios";
import { API_URL } from "@/config";
import { userTH, accountTH } from "@/system/token_holders";

export type AxiosOptions = {
  headers?: { [key: string]: string };
};

const server = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// current tokens
server.interceptors.request.use(
  async (req) => {
    const accountToken = accountTH.get();
    if (accountToken) {
      (req.headers as any)["x-account-token"] = `Bearer ${accountToken.token}`;
    }

    const userToken = userTH.get();
    if (userToken) {
      (req.headers as any)["x-user-token"] = `Bearer ${userToken.token}`;
    }

    return req;
  },
  (err) => err,
);

export { server };
