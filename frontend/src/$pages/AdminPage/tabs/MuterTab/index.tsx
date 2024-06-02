import React, { useEffect, Fragment } from "react";
import { useTranslations } from "next-intl";
import { Container, Gap, Row } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { CloseIcon } from "@/ui/icons";
import { Divider } from "@mui/material";
import { ListView } from "@/ui/tools/ListView";
import { InitBox, LoadingBox, ErrorBox } from "@/components/$statusTools";
import { MuterItem } from "./MuterItem";
// logic
import { useListData } from "@/hooks/ListData";
import * as MuterApi from "@/apis/muters";
import type { ListMuterOptionT, MuterT } from "@/types";


export function MuterTab(): JSX.Element {
  const t = useTranslations("pages.AdminPage.MuterTab");

  const { data: groupMuters$, actions: groupMutersAct } = useListData({
    listFn: MuterApi.list,
  });

  const listOpt: ListMuterOptionT = {
  };

  useEffect(() => {
    groupMutersAct.load(listOpt);
  },[]);

  function handleLoaderDetect(): void {
    groupMutersAct.refill();
  }

  function handleErrorRetry(): void {
    groupMutersAct.load(listOpt, { force: true });
  }

  function handleMuterDeleted(muter: MuterT): void {
    groupMutersAct.filterItems((item) => item.id != muter.id);
  }

  return (
    <Container rtlP>
      <Txt variant="h6">{t("restriction")}</Txt>
      <Gap y={1}/>

      <Divider/>

      <Gap y={2}/>

      {groupMuters$.status == "init" && (
        <InitBox/>
      )}

      {groupMuters$.status == "loading" && (
        <LoadingBox/>
      )}

      {groupMuters$.status == "error" && (
        <ErrorBox onRetry={handleErrorRetry}/>
      )}

      {groupMuters$.status == "loaded" && groupMuters$.data.length == 0 && (
        <Row justifyContent='center'>
          <CloseIcon sx={{ color: "vague.main" }}/>
          <Gap x={1}/>
          <Txt color='vague.main'>{t("noRestrictedUser")}</Txt>
        </Row>
      )}

      {groupMuters$.status == "loaded" && (
        <ListView
          data={groupMuters$.data}
          onLoaderDetect={handleLoaderDetect}
          renderItem={(groupMuter) => {
            return (
              <Fragment key = {groupMuter.id}>
                <MuterItem
                  muter={groupMuter}
                  onDeleted={handleMuterDeleted}
                />
              </Fragment>
            );
          }}
        />
      )}
    </Container>
  );
}