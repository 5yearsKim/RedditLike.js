

// (POST) /request
export type RequestRqs = {
  email: string,
  emailOpt?: { serviceName?: string, locale?: string }
}
export type RequestRsp = boolean

