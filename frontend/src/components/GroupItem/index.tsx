import React from "react";
import { Row, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { GroupAvatar } from "@/ui/tools/Avatar";
import type { GroupT } from "@/types";

type GroupItemProps = {
  group: GroupT
}

export function GroupItem({ group }: GroupItemProps): JSX.Element {
  return (
    <Row>
      <GroupAvatar group={group} size={30} />
      <Gap x={1}/>
      <Txt>{group.name}</Txt>
    </Row>
  );
}