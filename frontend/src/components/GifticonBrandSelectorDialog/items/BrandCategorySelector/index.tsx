"use client";
import React from "react";
import { useTheme } from "@mui/material/styles";
import { Row, Box } from "@/ui/layouts";

type BrandCategoryT = {
  label: string;
  value: string | undefined;
};

const candidates: BrandCategoryT[] = [
  { label: "모두", value: undefined },
  { label: "아이스크림", value: "아이스크림" },
  { label: "커피/음료", value: "커피/음료" },
  { label: "편의점", value: "편의점" },
  { label: "베이커리/도넛", value: "베이커리/도넛" },
  { label: "피자/치킨/버거", value: "피자/버거/치킨" },
  { label: "레저", value: "레저/여행" },
  { label: "상품권", value: "상품권/마트/페이" },
  { label: "외식/배달", value: "외식/분식/배달" },
  { label: "뷰티", value: "뷰티/헤어/바디" },
  { label: "생활", value: "출산/생활/통신" },
  // { label: '가전/디지털', value: '가전/디지털' },
  // { label: '식품/건강', value: '식품/건강' },
  { label: "주유권", value: "주유권" },
  { label: "문화", value: "영화/음악/도서" },
];

type BrandCategorySelectorProps = {
  selected: string | undefined;
  onSelect: (category: string | undefined) => void;
};

export function BrandCategorySelector(props: BrandCategorySelectorProps): JSX.Element {
  const { selected, onSelect } = props;

  const theme = useTheme();

  function handleCategorySelect(category: BrandCategoryT): void {
    onSelect(category.value);
  }

  const selectedSx = {
    bgcolor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: 500,
  };

  return (
    <Row
      flexWrap='wrap'
      justifyContent='center'
    >
      {candidates.map((cand) => {
        const isSelected = selected == cand.value;
        return (
          <Box
            key={cand.label}
            onClick={(): void => handleCategorySelect(cand)}
            mx={0.5}
            my={0.2}
            px={0.8}
            py={0.4}
            borderRadius={4}
            fontSize='12px'
            sx={{
              bgcolor: "rgba(128, 128, 128, 0.2)",
              color: theme.palette.text.primary,
              ...(isSelected ? selectedSx : {}),
              cursor: "pointer",
            }}
          >
            {cand.label}
          </Box>
        );
      })}
    </Row>
  );
}
