import { groupMuterM } from "@/models/GroupMuter";
import { encodeCursor, decodeCursor } from "@/utils/formatter";
import * as err from "@/errors";
import { GroupMuterT, ListGroupMuterOptionT } from "@/types";

export async function listGroupMuter(opt: ListGroupMuterOptionT): Promise<ListData<GroupMuterT>> {
  const table = groupMuterM.table;
  const limit = opt.limit ?? 30;
  let nextCursor: string|null = null;
  let getNextCursor: (item: GroupMuterT) => string|null = () => null;

  if (!opt.groupId) {
    throw new err.InvalidDataE("groupId should be given to fetch muter");
  }

  const fetched = await groupMuterM.find({
    builder: (qb) => {
      qb.limit(limit);
      qb.where(`${table}.group_id`, opt.groupId);

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