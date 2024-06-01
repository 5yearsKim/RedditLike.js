import React from "react";
import { Row, Gap, Box } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { Avatar } from "@/ui/tools/Avatar";
import type { UserT } from "@/types";

type GroupMemberItemProps = {
  user: UserT
}

export function GroupMemberItem({
  user,
}: GroupMemberItemProps) {
  return (
    <Row my={1}>
      <Avatar size="20px"/>
      <Gap x={1}/>
      <Box minWidth={300}>
        <Txt variant="body2">{user.account?.email ?? "(UNKNOWN)"}</Txt>
      </Box>
    </Row>
  );
}