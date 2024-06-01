import { server } from "@/system/server";
import * as R from "@/types/Post.api";
import type {
  PostFormT, GetPostOptionT, ListPostOptionT,
  FlagT, VideoT, ImageT,
} from "@/types";

const root = "/posts";

export async function create(
  form: PostFormT,
  relations: {flags?: FlagT[], images?: ImageT[], videos?: VideoT[]} = {},
): Promise<R.CreateRsp> {
  const body: R.CreateRqs = { form, relations };
  const rsp = await server.post(`${root}`, body);
  return rsp.data;
}

export async function get(id: idT, getOpt: GetPostOptionT): Promise<R.GetRsp> {
  const params: R.GetRqs = getOpt;
  const rsp = await server.get(`${root}/${id}`, { params } );
  return rsp.data;
}

export async function getWithGroupCheck(id: idT, groupKey: string, getOpt: GetPostOptionT): Promise<R.GetRsp> {
  const params: R.GetRqs = getOpt;
  const rsp = await server.get(`${root}/${id}/group-check/${groupKey}`, { params } );
  return rsp.data;
}

export async function update(
  id: idT,
  form: PostFormT,
  relations: {flags?: FlagT[], images?: ImageT[], videos?: VideoT[]} = {},
): Promise<R.UpdateRsp> {
  const body: R.UpdateRqs = { form, relations };
  const rsp = await server.patch(`${root}/${id}`, body);
  return rsp.data;
}

export async function remove(id: idT): Promise<R.DeleteRsp> {
  const rsp = await server.delete(`${root}/${id}`);
  return rsp.data;
}

export async function list(option: ListPostOptionT): Promise<R.ListRsp> {
  const params: R.ListRqs = option;
  const rsp = await server.get(`${root}`, { params });
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

export async function getImagePresignedUrl(mimeType: string): Promise<R.ImagePresignedUrlRsp> {
  const body = { mimeType } satisfies R.ImagePresignedUrlRqs;
  const rsp = await server.post(`${root}/images/presigned-url`, body);
  return rsp.data;
}

export async function getVideoPresignedUrl(mimeType: string): Promise<R.VideoPresignedUrlRsp> {
  const body = { mimeType } satisfies R.VideoPresignedUrlRqs;
  const rsp = await server.post(`${root}/videos/presigned-url`, body);
  return rsp.data;
}