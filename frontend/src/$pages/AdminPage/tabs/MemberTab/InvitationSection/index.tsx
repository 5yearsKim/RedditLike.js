import React, { useEffect, Fragment } from "react";
import { useTranslations } from "next-intl";
import { InitBox, LoadingBox, ErrorBox } from "@/components/$statusTools";
import { Col, Row, Expand, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { CloseIcon } from "@/ui/icons";
import { ListView } from "@/ui/tools/ListView";
import { useListData } from "@/hooks/ListData";
import { useGroup } from "@/stores/GroupStore";
import * as GroupInvitationApi from "@/apis/group_invitations";
import { InvitationItem } from "./InvitationItem";
import { InviteButton } from "./InviteButton";
import type { ListGroupInvitationOptionT, InviteStatusT, GroupInvitationT } from "@/types";


export function InvitationSection(): JSX.Element {
  const t = useTranslations("pages.AdminPage.MemberTab.InvitationSection");

  const group = useGroup();

  const listOpt: ListGroupInvitationOptionT = {
    groupId: group.id,
  };

  useEffect(() => {
    invitationsAct.load(listOpt);
  }, []);

  const { data: invitations$, actions: invitationsAct } = useListData({
    listFn: GroupInvitationApi.list,
  });

  function handleErrorRetry(): void {
    invitationsAct.load(listOpt, { force: true });
  }

  function handleLoaderDetect(): void {
    invitationsAct.refill();
  }

  function handleUserInvited(status: InviteStatusT, invitation: GroupInvitationT|null): void {
    if (status == "pending" || status == "accepted") {
      invitationsAct.splice(0, 0, invitation!);
    }
  }

  function handleInvitationDeleted(invitation: GroupInvitationT): void {
    invitationsAct.filterItems((item) => item.id != invitation.id);
  }

  const { status, data: invitations } = invitations$;

  if (status == "init") {
    return <InitBox/>;
  }
  if (status == "loading") {
    return <LoadingBox/>;
  }

  if (status == "error") {
    return <ErrorBox onRetry={handleErrorRetry}/>;
  }

  return (
    <Col>
      <Row width='100%' >
        <Txt variant="h6" fontWeight={700}>{t("invitedUser")}</Txt>
        <Expand/>
        <InviteButton onInvited={handleUserInvited}/>
      </Row>

      {invitations.length == 0 && (
        <Row justifyContent='center'>
          <CloseIcon sx={{ color: "vague.main" }}/>
          <Gap x={1}/>
          <Txt variant='body1' color='vague.main'>{t("noInvitedUser")}</Txt>
        </Row>
      )}

      <Gap y={2}/>

      <ListView
        data={invitations}
        onLoaderDetect={handleLoaderDetect}
        renderItem={(invitation) => {
          return (
            <Fragment key={invitation.id}>
              <InvitationItem
                invitation={invitation}
                onDeleted={handleInvitationDeleted}
              />
            </Fragment>
          );
        }}

      />
    </Col>
  );
}