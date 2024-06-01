import { server } from "@/system/server";
import * as R from "@/types/Comment.api";
import type { CommentFormT, GetCommentOptionT, ListCommentOptionT } from "@/types";

const root = "/comments";


export async function create(form: CommentFormT): Promise<R.CreateRsp> {
  const body: R.CreateRqs = { form };
  const rsp = await server.post(`${root}`, body);
  return rsp.data;
}

export async function get(id: idT, getOpt: GetCommentOptionT ): Promise<R.GetRsp> {
  const params = getOpt satisfies R.GetRqs;
  const rsp = await server.get(`${root}/${id}`, { params });
  return rsp.data;
}

export async function list(listOpt: ListCommentOptionT): Promise<R.ListRsp> {
  const params = listOpt satisfies R.ListRqs;
  const rsp = await server.get(`${root}`, { params });
  return rsp.data;
}

export async function update(id: idT, form: Partial<CommentFormT>): Promise<R.UpdateRsp> {
  const body: R.UpdateRqs = { form };
  const rsp = await server.patch(`${root}/${id}`, body);
  return rsp.data;
}

export async function remove(id: idT): Promise<R.DeleteRsp> {
  const rsp = await server.delete(`${root}/${id}`);
  return rsp.data;
}

export async function skim(listOpt: ListCommentOptionT): Promise<R.SkimRsp> {
  const params = listOpt satisfies R.SkimRqs;
  const rsp = await server.get(`${root}/skim`, { params });
  return rsp.data;
}


export async function approve(id: idT): Promise<R.ApproveRsp> {
  const rsp = await server.patch(`${root}/${id}/approve`);
  return rsp.data;
}

export async function trash(id: idT, reason: string): Promise<R.TrashRsp> {
  const body: R.TrashRqs = { reason };
  const rsp = await server.patch(`${root}/${id}/trash`, body);
  return rsp.data;
}

export async function adminTrash(id: idT, reason: string): Promise<R.AdminTrashRsp> {
  const body: R.AdminTrashRqs = { reason };
  const rsp = await server.patch(`${root}/${id}/admin-trash`, body);
  return rsp.data;
}

export async function getWithChildren(id: idT, listOpt: ListCommentOptionT): Promise<R.GetWithChildrenRsp> {
  const params = listOpt satisfies R.GetWithChildrenRqs;
  const rsp = await server.get(`${root}/${id}/with-children`, { params });
  return rsp.data;
}