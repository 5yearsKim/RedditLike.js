import React, { useEffect, Fragment } from "react";
import { useTranslations } from "next-intl";
import { useResponsive } from "@/hooks/Responsive";
import { Col, Row, Gap, Box, Expand } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { InitBox, LoadingBox, ErrorBox } from "@/components/$statusTools";
import { useListData } from "@/hooks/ListData";
import { useGroup } from "@/stores/GroupStore";
import { ListView } from "@/ui/tools/ListView";
import * as UserApi from "@/apis/users";
import { GroupMemberItem } from "./GroupMemberItem";
import type { ListUserOptionT } from "@/types";


export function CurrentMemberSection() {
  const t = useTranslations("pages.AdminPage.MemberTab.CurrentMemberSection");

  const group = useGroup();
  const { downSm } = useResponsive();

  const { data: user$, actions: userAct } = useListData({
    listFn: UserApi.list,
  });

  const listOpt: ListUserOptionT = {
    groupId: group.id,
  };

  useEffect(() => {
    userAct.load(listOpt);
  }, []);

  function handleLoaderDetect(): void {
    userAct.refill();
  }

  function handleErrorRetry(): void {
    userAct.load(listOpt, { force: true });
  }

  return (
    <Col>
      <Row>
        <Txt variant="h6">{t("groupMember")}</Txt>
        <Expand/>
        <Box maxWidth={downSm ? 200 : undefined}>
          <Txt variant="body3" color='vague.main'>
            {group.protection == "public" && t("publicDesc")}
            {group.protection == "protected" && t("protectedDesc")}
            {group.protection == "private" && t("privateDesc")}
          </Txt>
        </Box>
      </Row>

      <Gap y={2}/>

      {user$.status == "init" && (
        <InitBox/>
      )}

      {user$.status == "loading" && (
        <LoadingBox/>
      )}

      {user$.status == "error" && (
        <ErrorBox onRetry={handleErrorRetry}/>
      )}

      {user$.status == "loaded" && (
        <>
          <ListView
            data={user$.data}
            onLoaderDetect={handleLoaderDetect}
            renderItem={(user) => {
              return (
                <Fragment key={user.id}>
                  <GroupMemberItem user={user}/>
                </Fragment>
              );
            }}
          />
        </>
      )}

    </Col>
  );
}