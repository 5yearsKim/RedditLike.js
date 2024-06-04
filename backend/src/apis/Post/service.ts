import { Injectable } from "@nestjs/common";
import type {
  PostT, PostFormT, GetPostOptionT, ListPostOptionT,
  FlagT, ImageT, VideoT,
  XPostFlagFormT, XPostImageFormT, XPostVideoFormT,
} from "@/types";
import { postM, PostSqls } from "@/models/Post";
import { xPostFlagM } from "@/models/XPostFlag";
import { xPostImageM } from "@/models/XPostImage";
import { xPostVideoM } from "@/models/XPostVideo";
import { listPost } from "./fncs/list_post";
import { updateAggr, type PostAggrOptionT } from "./fncs/update_aggr";
import { createSignedUrl, addDevOnKey } from "@/utils/s3";
import { genUniqueId } from "@/utils/random";
import mime from "mime-types";
import * as err from "@/errors";
import { knex } from "@/global/db";

@Injectable()
export class PostService {
  constructor() {}

  async updateAggr(id: idT, opt: PostAggrOptionT): Promise<PostT|null> {
    return await updateAggr(id, opt);
  }

  async updateAggrAll(): Promise<void> {
    const posts = await postM.find();
    for (const post of posts) {
      await updateAggr(post.id, {
        numComment: true,
        voteInfo: true,
        hotScore: true,
      });
    }
  }

  async create(
    form: PostFormT,
    relations: {flags?: FlagT[], images?: ImageT[], videos?: VideoT[] } = {}
  ): Promise<PostT> {
    let created: PostT | null = null;
    const { flags, images, videos } = relations;

    await knex.transaction(async (trx) => {
      created = await postM.create(form, { trx: trx });
      if (!created) {
        throw new err.NotAppliedE();
      }

      if (flags?.length) {
        const xFlagForms = flags.map<XPostFlagFormT>((flag, idx) => {
          return {
            flag_id: flag.id,
            post_id: created!.id,
            rank: idx,
          };
        });
        await xPostFlagM.createMany(xFlagForms, { trx: trx });
      }

      if (images?.length) {
        const xImageForms = images.map<XPostImageFormT>((image, idx) => {
          return {
            image_id: image.id,
            post_id: created!.id,
            rank: idx,
          };
        });
        await xPostImageM.createMany(xImageForms, { trx: trx });
      }

      if (videos?.length) {
        const xVideoForms = videos.map<XPostVideoFormT>((video, idx) => {
          return {
            video_id: video.id,
            post_id: created!.id,
            rank: idx,
          };
        });
        await xPostVideoM.createMany(xVideoForms, { trx: trx });
      }
    });
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }

  async get(id: idT, opt: GetPostOptionT = {}): Promise<PostT> {

    const sqls = new PostSqls(postM.table);

    const fetched = await postM.findById(id, {
      builder: (qb, select) => {
        if (opt.$defaults) {
          select.push(...sqls.defaults());
        }
        if (opt.$user_defaults && opt.userId) {
          select.push(...sqls.userDefaults(opt.userId));
        }
        if (opt.$manager_defaults) {
          select.push(...sqls.managerDefaults());
        }
        if (opt.$board) {
          select.push(sqls.board());
        }
        if (opt.$pin) {
          select.push(sqls.pin());
        }
      }
    });
    if (!fetched) {
      throw new err.NotExistE();
    }
    return fetched;
  }


  async update(
    id: idT,
    form: Partial<PostFormT>,
    relations: {flags?: FlagT[], images?: ImageT[], videos?: VideoT[] } = {}
  ): Promise<PostT> {

    const { flags, images, videos } = relations;

    let updated: null|PostT = null;
    await knex.transaction(async (trx) => {
      updated = await postM.updateOne({ id }, form, { trx: trx });
      if (!updated) {
        throw new err.NotAppliedE();
      }

      const postId = updated!.id;

      if (flags?.length) {
        await xPostFlagM.deleteMany({ post_id: postId }, { trx: trx });

        const xFlagForms = flags.map<XPostFlagFormT>((flag, idx) => {
          return {
            flag_id: flag.id,
            post_id: postId,
            rank: idx,
          };
        });
        await xPostFlagM.createMany(xFlagForms, { trx: trx });
      }

      if (images?.length) {
        await xPostImageM.deleteMany({ post_id: postId }, { trx: trx });

        const xImageForms = images.map<XPostImageFormT>((image, idx) => {
          return {
            image_id: image.id,
            post_id: postId,
            rank: idx,
          };
        });
        await xPostImageM.createMany(xImageForms, { trx: trx });
      }


      if (videos?.length) {
        await xPostVideoM.deleteMany({ post_id: postId }, { trx: trx });

        const xVideoForms = videos.map<XPostVideoFormT>((video, idx) => {
          return {
            video_id: video.id,
            post_id: postId,
            rank: idx,
          };
        });
        await xPostVideoM.createMany(xVideoForms, { trx: trx });
      }
    });


    if (!updated) {
      throw new err.NotAppliedE();
    }
    return updated;
  }

  async delete(id: idT): Promise<PostT> {
    const deleted = await postM.updateOne({ id }, { deleted_at: new Date() });
    if (!deleted) {
      throw new err.NotAppliedE();
    }
    return deleted;
  }

  async list(opt: ListPostOptionT): Promise<ListData<PostT>> {
    return await listPost(opt);
  }

  async getImagePresignedUrl(mimeType: string): Promise<{putUrl: string, key: string}> {
    if (!mimeType.startsWith("image/")) {
      throw new err.InvalidDataE("mimeType must be image/*");
    }

    let key = `images/posts/${new Date().getTime()}_${genUniqueId({ len: 8 })}}.${mime.extension(mimeType)}`;
    key = addDevOnKey(key);

    const presignedUrl = await createSignedUrl(key, mimeType);
    return { putUrl: presignedUrl, key };
  }

  async getVideoPresignedUrl(mimeType: string): Promise<{putUrl: string, key: string}> {
    if (!mimeType.startsWith("video/")) {
      throw new err.InvalidDataE("mimeType must be video/*");
    }

    let key = `videos/posts/${new Date().getTime()}_${genUniqueId({ len: 8 })}}.${mime.extension(mimeType)}`;
    key = addDevOnKey(key);

    const presignedUrl = await createSignedUrl(key, mimeType);
    return { putUrl: presignedUrl, key };
  }

}