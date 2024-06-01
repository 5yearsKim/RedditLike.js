import { server } from "@/system/server";
import * as R from "@/types/XUserCategory.api";

const root = "/x-user-category";

export async function create(categoryId: idT): Promise<R.CreateRsp> {
  const body: R.CreateRqs = { categoryId };
  const rsp = await server.post(`${root}/`, body);
  return rsp.data;
}

export async function remove(categoryId: idT) {
  const body: R.DeleteRqs = { categoryId };
  const rsp = await server.delete(`${root}/`, { data: body });
  return rsp.data;
}