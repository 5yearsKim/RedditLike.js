import { groupInvitationM } from "@/models/GroupInvitation";
import * as err from "@/errors";
import { encodeCursor, decodeCursor } from "@/utils/formatter";
import { ListGroupInvitationOptionT, GroupInvitationT } from "@/types/GroupInvitation";


export async function listGroupInvitation(opt: ListGroupInvitationOptionT): Promise<ListData<GroupInvitationT>> {
  const table = groupInvitationM.table;

  const limit = opt.limit ?? 30;

  let nextCursor: string|null = null;
  let getNextCursor: (item: GroupInvitationT) => string|null = () => null;


  const fetched = await groupInvitationM.find({
    builder: (qb) => {
      qb.limit(limit);

      // groupId
      if (opt.groupId) {
        qb.where(`${table}.group_id`, opt.groupId);
      }

      // email
      if (opt.email) {
        qb.where(`${table}.email`, opt.email);
      }

      // sort
      switch (opt.sort ?? "recent") {
      case "recent":
        qb.orderByRaw(`${table}.created_at DESC`);
        getNextCursor = (item): string => encodeCursor({
          created_at: item.created_at,
        });
        if (opt.cursor) {
          const cursor = decodeCursor(opt.cursor);
          qb.where(`${table}.created_at`, "<", cursor.created_at);
        }
        break;
      case "old":
        qb.orderByRaw(`${table}.created_at ASC`);
        getNextCursor = (item): string => encodeCursor({
          created_at: item.created_at,
        });
        if (opt.cursor) {
          const cursor = decodeCursor(opt.cursor);
          qb.where(`${table}.created_at`, ">", cursor.created_at);
        }
        break;
      default:
        throw new err.InvalidDataE(`invalid sort: ${opt.sort}`);
      }

      // declined
      if (opt.declined) {
        switch (opt.declined) {
        case "except":
          qb.whereNull(`${table}.declined_at`);
          break;
        case "only":
          qb.whereNotNull(`${table}.declined_at`);
          break;
        default:
          throw new err.InvalidDataE(`invalid declinedd: ${opt.declined}`);
        }
      }
    }
  });

  if (fetched.length > limit) {
    const lastItem = fetched[fetched.length - 1];
    nextCursor = getNextCursor(lastItem);
  }

  return {
    data: fetched,
    nextCursor,
  };

}