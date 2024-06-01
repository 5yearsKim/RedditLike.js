import { useTranslations } from "next-intl";

export interface ReportCategoryT {
  key: string;
  label: string;
  description: string;
}

export function useReportCategories() {
  const t = useTranslations("hooks.dialogs.ReportDialog");

  const reportCategories: ReportCategoryT[] = [
    {
      key: "ruleViolation",
      label: t("ruleViolation"),
      description: t("ruleViolationMsg"),
    },
    {
      key: "spam",
      label: t("spam"),
      description: t("spamMsg"),
    },
    {
      key: "hate",
      label: t("hate"),
      description: t("hateMsg"),
    },
    {
      key: "scam",
      label: t("scam"),
      description: t("scamMsg"),
    },
    {
      key: "sexual",
      label: t("sexual"),
      description: t("sexualMsg"),
    },
    {
      key: "repeat",
      label: t("repeat"),
      description: t("repeatMsg"),
    },
    {
      key: "threatening",
      label: t("threatening"),
      description: t("threateningMsg"),
    },
    {
      key: "copyrightViolation",
      label: t("copyrightViolation"),
      description: t("copyRightViolationMsg"),
    },
    {
      key: "illegal",
      label: t("illegal") ,
      description: t("illegalMsg"),
    },
  ];
  return reportCategories;
}
