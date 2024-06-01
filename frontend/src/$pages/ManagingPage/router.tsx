"use client";
import React from "react";
import { useParams } from "next/navigation";

import { CensorTab } from "./tabs/CensorTab";
import { ReportTab } from "./tabs/ReportTab";
import { ContentsTab } from "./tabs/ContentsTab";
import { ExposureTab } from "./tabs/ExposureTab";
import { EtcTab } from "./tabs/EtcTab";
import { IntroTab } from "./tabs/IntroTab";
import { InfoTab } from "./tabs/InfoTab";
import { ManagerTab } from "./tabs/ManagerTab";
import { MuterTab } from "./tabs/MuterTab";

export function ManagingRouter(): JSX.Element {
  const { tab } = useParams();

  switch (tab) {
  case "censor":
    return <CensorTab />;
  case "report":
    return <ReportTab />;
  case "contents":
    return <ContentsTab />;
  case "exposure":
    return <ExposureTab />;
  case "info":
    return <InfoTab />;
  case "intro":
    return <IntroTab />;
  case "manager":
    return <ManagerTab />;
  case "muter":
    return <MuterTab />;
  case "etc":
    return <EtcTab />;
  default:
    return <div>default</div>;
  }
}
