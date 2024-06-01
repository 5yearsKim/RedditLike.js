import { getCookie, setCookie, deleteCookie } from "cookies-next";

type TokenHolderOptionT = {
  key: string;
  saveCookie?: boolean;
  resetOnExpire?: boolean;
}

type TokenInfoT = {
  token: string;
  expiresAt: number;
  meta?: { [key: string]: any };
};


export class TokenHolder {
  tokenInfo: null | TokenInfoT;
  option: TokenHolderOptionT;

  constructor(option: TokenHolderOptionT = {
    saveCookie: false,
    resetOnExpire: true,
    key: "tokenHolder",
  }) {
    this.option = option;
    this.tokenInfo = null;
    if (option.saveCookie) {
      this.initFromCookie(option.key);
    }
    // this.tokenChangeListerners = new Map();
  }

  /** deprecated: use serverFetchWithCookie instead */
  initFromCookie(key: string, { req, res, cookies }: {req?: any, res?: any, cookies?: any} = {}) {
    // const cached = localStorage.getItem(option.key);
    const cached = getCookie(key, { req, res, cookies });
    if (cached) {
      try {
        const decoded = JSON.parse(cached.toString());
        this.tokenInfo = decoded;
      } catch (e) {
        console.warn("removing key with error: ", e);
        deleteCookie(key);
      }
    }
  }

  async serverFetchWithCookie<T>(cookies: any, fn: (...args: any[]) => Promise<T>): Promise<T> {
    if (typeof window !== "undefined") {
      throw new Error("serverFetchWithCookie should be called in server side only");
    }
    // setup cookies if exists
    const cached = getCookie(this.option.key, { cookies });
    if (cached) {
      try {
        const decoded = JSON.parse(cached);
        this.tokenInfo = decoded;
      } catch (e) {
        console.warn("removing key with error: ", e);
        deleteCookie(this.option.key);
      }
    }

    // run functions
    try {
      const result = await fn();
      return result;
    } catch (e) {
      throw e;
    } finally {
      this.tokenInfo = null;
    }

  }


  set(tokenInfo: TokenInfoT): void {
    this.tokenInfo = tokenInfo;
    if (this.option.saveCookie) {
      setCookie(this.option.key, JSON.stringify(tokenInfo), { maxAge: 60 * 60 * 24 * 365 });
    }
  }

  reset(): void {
    this.tokenInfo = null;
    if (this.option.saveCookie) {
      deleteCookie(this.option.key);
    }
  }

  get(): TokenInfoT | null {
    if (this.option.resetOnExpire && this.tokenInfo) {
      const now = new Date();
      const expiresAt = new Date(this.tokenInfo.expiresAt * 1000);
      if (now > expiresAt) {
        this.reset();
      }
    }
    return this.tokenInfo;
  }
}
