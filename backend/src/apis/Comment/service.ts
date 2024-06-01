import { Injectable } from "@nestjs/common";
import { commentM, CommentSqls, getCommentOptionSchema } from "@/models/Comment";
import { boardM } from "@/models/Board";
import { postM } from "@/models/Post";
import { listComment } from "./fncs/list_comment";
import { updateAggr, CommentAggrOptionT } from "./fncs/update_aggr";
import { appendChildren } from "@/utils/appendable";
import { knex } from "@/global/db";
import * as err from "@/errors";
import type {
  CommentT, CommentFormT, GetCommentOptionT, ListCommentOptionT,
  BoardT, PostT,
} from "@/types";

@Injectable()
export class CommentService {
  constructor() {}

  async updateAggr(id: idT, opt: CommentAggrOptionT): Promise<CommentT|null> {
    return await updateAggr(id, opt);
  }

  async updateAggrAll(): Promise<void> {
    const comments = await commentM.find();
    for (const comment of comments) {
      await updateAggr(comment.id, {
        numChildren: true,
        voteInfo: true,
      });
    }
  }

  async getBoard(commentId: idT): Promise<BoardT> {
    const comment = await this.get(commentId, { $post: true });
    const board = await boardM.findById(comment.post!.board_id);
    if (!board) {
      throw new err.NotExistE();
    }
    return board;
  }

  async getPost(id: idT): Promise<PostT> {
    const post = await postM.findById(id);
    if (!post) {
      throw new err.NotExistE();
    }
    return post;
  }

  async get(id: idT, opt: GetCommentOptionT): Promise<CommentT> {
    const comment = await commentM.findById(id, {
      builder: (qb, select) => {

        const sqls = new CommentSqls(commentM.table);
        if (opt.$defaults) {
          select.push(...sqls.defaults());
        }
        if (opt.$user_defaults && opt.userId) {
          select.push(...sqls.userDefaults(opt.userId));
        }
        if (opt.$manager_defaults) {
          select.push(...sqls.managerDefaults());
        }
        if (opt.$post) {
          select.push(sqls.post());
        }
        if (opt.$parent) {
          select.push(sqls.parent());
        }
        if (opt.$author_idx) {
          select.push(sqls.authorIdx());
        }
      }
    });
    if (!comment) {
      throw new err.NotExistE();
    }
    return comment;
  }

  async create(form: CommentFormT): Promise<CommentT> {
    const created = await commentM.create(form);
    if (!created) {
      throw new err.NotAppliedE();
    }

    // insert author idx
    await knex("post_comment_author_idx")
      .insert({
        author_id: created.author_id,
        post_id: created.post_id,
        idx: knex.count("*")
          .from("post_comment_author_idx")
          .where({ post_id: created.post_id }),
      })
      .onConflict(["author_id", "post_id"]).ignore();


    return created;
  }

  async update(id: idT, form: Partial<CommentFormT>): Promise<CommentT> {
    const updated = await commentM.updateOne({ id }, form);
    if (!updated) {
      throw new err.NotAppliedE();
    }
    return updated;
  }

  async remove (id: idT): Promise<CommentT> {
    const deleted = await commentM.deleteOne({ id });
    if (!deleted) {
      throw new err.NotAppliedE();
    }

    if (deleted.parent_id) {
      this.updateAggr(deleted.parent_id, { numChildren: true });
    }
    return deleted;
  }

  async list(listOpt: ListCommentOptionT): Promise<ListData<CommentT>> {
    const { data, nextCursor } = await listComment(listOpt);

    return { data, nextCursor };
  }

  async skim(listOpt: ListCommentOptionT ): Promise<ListData<CommentT>> {
    const { data: roots, nextCursor } = await listComment({
      ...listOpt,
      rootPath: null,
    });

    for (let i = 0; i < roots.length; i++) {
      const root = roots[i];
      if (!root.num_children) {
        continue;
      }
      const getOpt = getCommentOptionSchema.parse(listOpt);
      const { data: children } = await listComment({
        ...getOpt,
        limit: 10,
        rootPath: root.path ? `${root.path}.${root.id}` : `${root.id}`,
      });
      const [appended] = appendChildren([root.id], [root, ...children]);
      roots[i] = appended;
    }


    return { data: roots, nextCursor };
  }

  async getWithChildren(id: idT, listOpt: ListCommentOptionT): Promise<CommentT> {
    const comment = await this.get(id, listOpt);

    const getOpt = getCommentOptionSchema.parse(listOpt);

    const { data: children } = await listComment({
      ...getOpt,
      limit: 30,
      rootPath: comment.path ? `${comment.path}.${comment.id}` : `${comment.id}`,
    });

    children.push(comment);
    const [appended] = appendChildren([comment.id], children);
    return appended;
  }

}