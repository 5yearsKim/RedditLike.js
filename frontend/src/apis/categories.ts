import { server } from "@/system/server";
import * as R from "@/types/Category.api";
import {
  CategoryFormT, ListCategoryOptionT, GetCategoryOptionT,
} from "@/types/Category";


const root = "/categories";


export async function get(id: idT, getOpt:GetCategoryOptionT = {}): Promise<R.GetRsp> {
  const params: R.GetRqs = getOpt;
  const rsp = await server.get(`${root}/${id}`, { params });
  return rsp.data;
}

export async function create(form: CategoryFormT): Promise<R.CreateRsp> {
  const body: R.CreateRqs = { form };
  const rsp = await server.post(`${root}`, body);
  return rsp.data;
}

export async function update(id: idT, form: Partial<CategoryFormT>): Promise<R.UpdateRsp> {
  const body: R.UpdateRqs = { form };
  const rsp = await server.patch(`${root}/${id}`, body);
  return rsp.data;
}

export async function remove(id: idT): Promise<R.DeleteRsp> {
  const rsp = await server.delete(`${root}/${id}`);
  return rsp.data;
}

export async function list(listOpt: ListCategoryOptionT): Promise<R.ListRsp> {
  const params: R.ListRqs = listOpt ;
  const rsp = await server.get(`${root}`, { params });
  return rsp.data;
}

export async function rerank(categoryIds: idT[]): Promise<R.RerankRsp> {
  const body: R.RerankRqs = { categoryIds };
  const rsp = await server.put(`${root}/rerank`, body);
  return rsp.data;
}