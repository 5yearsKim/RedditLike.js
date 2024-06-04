import { muterM } from "@/models/Muter";
import { encodeCursor, decodeCursor } from "@/utils/formatter";
import * as err from "@/errors";
import { MuterT, ListMuterOptionT } from "@/types";

export async function listMuter(opt: ListMuterOptionT): Promise<ListData<MuterT>> {
  const table = muterM.table;
  const limit = opt.limit ?? 30;
  let nextCursor: string|null = null;
  let getNextCursor: (item: MuterT) => string|null = () => null;

  const fetched = await muterM.find({
    builder: (qb) => {
      qb.limit(limit);

      switch (opt.sort ?? "recent") {
      case "recent":
        qb.orderByRaw(`${table}.created_at DESC`);
        getNextCursor = (item) => encodeCursor({
          created_at: item.created_at,
        });
        if (opt.cursor) {
          const cursor = decodeCursor(opt.cursor);
          qb.where("created_at", "<", cursor.created_at);
        }
        break;
      case "old":
        qb.orderBy(`${table}.created_at ASC`);
        getNextCursor = (item) => encodeCursor({
          created_at: item.created_at,
        });
        if (opt.cursor) {
          const cursor = decodeCursor(opt.cursor);
          qb.where("created_at", ">", cursor.created_at);
        }
        break;
      default:
        throw new err.InvalidDataE("invalid sort option: " + opt.sort );
      }
    }
  });

  if (fetched.length >= limit) {
    const lastItem = fetched[fetched.length - 1];
    nextCursor = getNextCursor(lastItem);
  }

  return {
    data: fetched,
    nextCursor,
  };
}