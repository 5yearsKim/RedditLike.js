
export function getIpFromHeader(headers: any) : string {
  const ips = headers["x-forwarded-for"];
  if (Array.isArray(ips)) {
    return ips[0];
  }
  return ips;
}