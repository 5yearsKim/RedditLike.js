import React from "react";
import { Center } from "@/ui/layouts";
import { usePointReportsStore } from "@/stores/PointReportsStore";

export function PointBadge(): JSX.Element {
  const { pointReports$ } = usePointReportsStore();

  const { data: pointReports } = pointReports$;

  const uncheced = pointReports.filter((item) => !item.is_checked);

  if (uncheced.length == 0) {
    return <></>;
  }
  return (
    <Center
      bgcolor='secondary.main'
      color='#fff'
      width={20}
      height={20}
      borderRadius={4}
      fontSize={13}
      fontWeight={500}
    >
      {uncheced.length}
    </Center>
  );
}
