import { styled } from "@mui/material/styles";

export interface HtmlParserProps {
  html: string;
  className?: string;
  lineHeight?: string;
  fontSize?: string;
}

type HtmlStyleProviderProps = {
  lineHeight?: string;
  fontSize?: string;
};

export const HtmlStyleProvider = styled("div")<HtmlStyleProviderProps>(({ theme, lineHeight, fontSize }) => {
  return `
    p {
      color: ${theme.palette.text.primary};
      font-size: ${fontSize ?? "inherit"};
      line-height: ${lineHeight ?? "inherit"};
    }
  `;
});
