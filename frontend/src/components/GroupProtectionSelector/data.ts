import { GroupProtectionT } from "@/types";
import { useTranslations } from "next-intl";


export function useGroupProtectionMap() {
  const t = useTranslations("components.GroupProtectionSelector");

  const groupProtectionMap: Record<GroupProtectionT, {name: string, helper: string}> = {
    public: {
      name: t("public"),
      helper: t("publicHelper"),
    },
    protected: {
      name: t("protected"),
      helper: t("protectedHelper"),
    },
    private: {
      name: t("private"),
      helper: t("privateHelper"),
    },
  };
  return groupProtectionMap;

}
