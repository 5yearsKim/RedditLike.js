import React, { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { useMeAdmin } from "@/stores/UserStore";
import { Txt } from "@/ui/texts";
import { Center } from "@/ui/layouts";

import { CategoryTab } from "./tabs/CategoryTab";
import { AdminTab } from "./tabs/AdminTab";
import { PostTab } from "./tabs/PostTab";
import { MemberTab } from "./tabs/MemberTab";
import { MuterTab } from "./tabs/MuterTab";
import { CensorTab } from "./tabs/CensorTab";
import type { AdminT } from "@/types";

export function AdminRouter(): JSX.Element {
  const { tab } = useParams();


  switch (tab) {
  case "category":
    return (
      <AccessCheckProvider access='manage_category'>
        <CategoryTab />
      </AccessCheckProvider>
    );
  case "admins":
    return (
      <AccessCheckProvider access='manage_admin'>
        <AdminTab />
      </AccessCheckProvider>
    );
  case "member":
    return (
      <AccessCheckProvider access='manage_member'>
        <MemberTab/>
      </AccessCheckProvider>
    );
  case "muter":
    return (
      <AccessCheckProvider access='manage_muter'>
        <MuterTab/>
      </AccessCheckProvider>
    );
  case "board":
    return (
      <div>board</div>
    );
  case "post":
    return (
      <PostTab />
    );
  case "censor":
    return (
      <AccessCheckProvider access='manage_censor'>
        <CensorTab/>
      </AccessCheckProvider>
    );
  default:
    return (
      <Center
        width='100%'
        minHeight='60vh'
      >
        <Txt color='vague.main'>please select tab</Txt>
      </Center>
    );
  }
}

type AccessCheckProviderProps = {
  access: keyof AdminT;
  children: ReactNode;
};


function AccessCheckProvider({
  access,
  children,
}: AccessCheckProviderProps): ReactNode {
  const t = useTranslations("pages.AdminPage");

  const admin = useMeAdmin();

  if (!admin) {
    throw new Error("admin should always exists");
  }


  if (!admin[access]) {
    return (
      <Center
        width='100%'
        minHeight='60vh'
      >
        <Txt color='vague.main'>{t("noAccessRight")}</Txt>
      </Center>
    );
  }

  return children;
}
