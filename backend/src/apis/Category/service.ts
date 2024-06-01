import { Injectable } from "@nestjs/common";
import { categoryM, CategorySqls } from "@/models/Category";
import * as err from "@/errors";
import type { CategoryFormT, CategoryT, GetCategoryOptionT, ListCategoryOptionT } from "@/types";

function lookupBuilder(select: any[], opt: GetCategoryOptionT): void {
  const sqls = new CategorySqls(categoryM.table);
  if (opt.$my_like && opt.userId) {
    select.push(sqls.myLike(opt.userId));
  }
}

@Injectable()
export class CategoryService {
  constructor() {}

  async get(id: idT, getOpt:GetCategoryOptionT = {}): Promise<CategoryT> {
    const fetched = await categoryM.findById(id, {
      builder: (qb, select) => {
        lookupBuilder(select, getOpt);
      }
    });
    if (!fetched) {
      throw new err.NotExistE();
    }
    return fetched;

  }

  async create(form: CategoryFormT): Promise<CategoryT> {
    const created = await categoryM.create(form);
    if (!created) {
      throw new err.NotAppliedE();
    }
    return created;
  }

  async update(id: idT, form: Partial<CategoryFormT>): Promise<CategoryT> {
    const updated = await categoryM.updateOne({ id }, form);
    if (!updated) {
      throw new err.NotAppliedE();
    }
    return updated;
  }

  async list(listOpt: ListCategoryOptionT): Promise<ListData<CategoryT>> {
    const opt = listOpt;
    const fetched = await categoryM.find({
      builder: (qb, select) => {

        qb.orderByRaw(`${categoryM.table}.rank ASC`);

        // groupId
        if (opt.groupId) {
          qb.where("group_id", opt.groupId);
        }

        // boardId
        if (opt.boardId) {
          qb.innerJoin("x_board_category AS xbc", function (this) {
            this.on("xbc.category_id", "=", `${categoryM.table}.id`)
              .andOn("xbc.board_id", "=", opt.boardId as any);
          });
        }
        lookupBuilder(select, opt);
      }
    });
    return { data: fetched, nextCursor: null };
  }

  async delete(id: idT): Promise<CategoryT> {
    const deleted = await categoryM.deleteOne({ id });
    if (!deleted) {
      throw new err.NotAppliedE();
    }
    return deleted;
  }


  async rerank(groupId: idT, categoriIds: idT[]): Promise<CategoryT[]> {
    const fetched = await categoryM.find({
      builder: (qb) => {
        qb.whereIn("id", categoriIds);
      }
    });
    const categories = fetched.filter((item) => item.group_id === groupId);

    for (const category of categories) {
      const rank = categoriIds.indexOf(category.id);
      if (rank >= 0) {
        category.rank = rank;
      }
    }
    let newCategories = await Promise.all(
      categories.map(async (category) => {
        const updated = await categoryM.updateOne({ id: category.id }, { rank: category.rank });
        if (!updated) {
          throw new err.NotExistE("category not exists");
        }
        return updated;
      })
    );
    newCategories = newCategories.sort((a, b) => a.rank! - b.rank!);
    return newCategories;
  }

}