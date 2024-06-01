"use client";
import React, { Fragment, useEffect, ReactNode } from "react";
import { Col, Row, Box } from "@/ui/layouts";
import { Clickable } from "@/ui/tools/Clickable";
import { LoadingIndicator, ErrorButton } from "@/components/$statusTools";
import { GroupItem } from "@/components/GroupItem";

// logic
import { useListData } from "@/hooks/ListData";
import * as GroupApi from "@/apis/groups";
import { useAccount } from "@/stores/AccountStore";
import { useGroup$ } from "@/stores/GroupStore";
import type { ListGroupOptionT, GroupT } from "@/types";

type MyGroupListProps = {
  onGroupClick: (group: GroupT) => void
  renderGroup?: (group: GroupT) => ReactNode
}

export function MyGroupList({
  onGroupClick,
  renderGroup,
}: MyGroupListProps) {
  const { data: groups$, actions: groupsAct } = useListData({
    listFn: GroupApi.list,
  });
  const account = useAccount();
  const group$ = useGroup$();

  const listOpt: ListGroupOptionT = {
    joined: "only",
  };

  useEffect(() => {
    if (account) {
      groupsAct.load(listOpt);
    } else {
      groupsAct.patch({ status: "loaded", data: [] });
    }
  }, [account?.id]);

  function handleErrorRetry(): void {
    groupsAct.load(listOpt, { force: true });
  }

  const { status, data: groups } = groups$;

  if (status == "init") {
    return <></>;
  }
  if (status == "loading") {
    return <LoadingIndicator size='1rem'/>;
  }
  if (status == "error") {
    return (
      <Row justifyContent='center'>
        <ErrorButton onRetry={handleErrorRetry}/>
      </Row>
    );
  }
  return (
    <Col>
      {groups.map((group) => {
        if (group$.status == "loaded" && group.id == group$.data!.group.id) {
          return null;
        }
        return (
          <Fragment key={group.id}>
            <Clickable onClick={() => onGroupClick(group)}>
              {renderGroup ?
                renderGroup(group) : (
                  <Box px={1} py={0.5} width='100%'>
                    <GroupItem group={group}/>
                  </Box>
                )}
            </Clickable>
          </Fragment>
        );
      })}
    </Col>
  );
}