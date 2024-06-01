import React from "react";

import { ReportTab } from "./tabs/ReportTab";
import { ShopTab } from "./tabs/ShopTab";
import { CouponTab } from "./tabs/CouponTab";

import type { UserT } from "@/types";

export function PointRouter({ tab, me }: { tab: string; me: UserT }): JSX.Element {

  if (tab == "report") {
    return (
      <ReportTab
        me={me}
      />
    );
  }
  if (tab == "shop") {
    return (
      <ShopTab
        me={me}
      />
    );
  }
  if (tab == "coupon") {
    return (
      <CouponTab
        me={me}
      />
    );
  }
  return <div></div>;
}
