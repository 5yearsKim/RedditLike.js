import { Injectable } from "@nestjs/common";
// import * as err from "@/errors";
import { groupInvitationM } from "@/models/GroupInvitation";
import { userM } from "@/models/User";
import { groupM } from "@/models/Group";
import { listGroupInvitation } from "./fncs/list_group_invitation";
import * as err from "@/errors";
import { env } from "@/env";
import {
  GroupInvitationFormT, InviteStatusT, GroupInvitationT,
  ListGroupInvitationOptionT,
} from "@/types/GroupInvitation";

@Injectable()
export class GroupInvitationService {
  constructor() {}

  async get(id: idT): Promise<GroupInvitationT> {
    const fetched = await groupInvitationM.findById(id);
    if (!fetched) {
      throw new err.NotExistE();
    }
    return fetched;
  }

  async list(opt: ListGroupInvitationOptionT): Promise<ListData<GroupInvitationT>> {
    return await listGroupInvitation(opt);
  }

  async remove(id: idT): Promise<GroupInvitationT> {
    const deleted = await groupInvitationM.deleteOne({ id });
    if (!deleted) {
      throw new err.NotAppliedE();
    }
    return deleted;
  }

  async invite(groupId: idT, email: string): Promise<{status: InviteStatusT, invitation: GroupInvitationT|null}> {
    const user = await userM.findOne({}, {
      builder: (qb) => {
        qb.leftJoin("accounts", "users.account_id", "accounts.id");
        qb.where("accounts.email", email);
        qb.where("users.group_id", groupId);
        qb.where("users.deleted_at", null);
      }
    });

    if (user) {
      return { status: "alreadyMember", invitation: null };
    }
    // fetch group
    const group = await groupM.findById(groupId);
    if (!group) {
      throw new err.NotExistE("group not exists");
    }

    const groupInvitation = await groupInvitationM.findOne({ group_id: groupId, email });
    if (groupInvitation) {
      if (groupInvitation.declined_at) {
        return { status: "declined", invitation: groupInvitation };
      } else {
        await sendGroupInvitationEmail(email, group);
        return { status: "pending", invitation: groupInvitation };
      }
    } else {
      const groupInvitationForm: GroupInvitationFormT = {
        group_id: groupId,
        email,
      };
      const created = await groupInvitationM.upsert(groupInvitationForm, { onConflict: ["group_id", "email"] });

      await sendGroupInvitationEmail(email, group);

      return { status: "pending", invitation: created };
    }
  }
}


import { transporter } from "@/utils/email";
import type { GroupT } from "@/types/Group";

async function sendGroupInvitationEmail(receiver: string, group: GroupT): Promise<void> {
  const SERVICE_NAME = "브이밀로(v-milo)";
  const FRON_URL_SUFFIX = "v-milo.com";

  await transporter.sendMail({
    from: `${SERVICE_NAME}<${env.GMAIL_MAIL}>`,
    to: receiver,
    subject: `'${group.name}' 그룹에 초대되었어요!`,
    html: `
      <p>${receiver} 계정으로 '${group.name}' 그룹에 초대되었어요.</p>
      <p>아래 주소로 그룹을 방문해서 가입해주세요!</p>
      <a href="https://${group.key}.${FRON_URL_SUFFIX}">${group.name}(${group.key}.${FRON_URL_SUFFIX})</a>
    `
  });
}