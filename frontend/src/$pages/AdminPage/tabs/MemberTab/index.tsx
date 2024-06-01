import React, { useState, SyntheticEvent } from "react";
import { useTranslations } from "next-intl";
import { Container, Gap, Box } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { Tabs, Tab } from "@mui/material";
import { CurrentMemberSection } from "./CurrentMemeberSection";
import { InvitationSection } from "./InvitationSection";

// logic

export function MemberTab() {
  const t = useTranslations("pages.AdminPage.MemberTab");
  const [tab, setTab] = useState<number>(0);

  function handleTabChange(e: SyntheticEvent, newVal: number): void {
    setTab(newVal);
  }


  return (
    <Container rtlP>
      <Txt variant="h6">{t("manageMember")}</Txt>

      <Gap y={2}/>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
        >
          <Tab label={t("groupMember")} />
          <Tab label={t("inviteGroup")} />
        </Tabs>
      </Box>

      <Gap y={2}/>

      {tab == 0 && (
        <CurrentMemberSection/>
      )}

      {tab == 1 && (
        <InvitationSection/>
      )}

      {/* <Row>
        <InviteButton/>
      </Row> */}
    </Container>
  );
}