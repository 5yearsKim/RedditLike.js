export type RichEditorDisableFeatureT = "youtube" | "heading" | "align" | "link" | "tweet"| "poll";

export type RichEditor2Props = {
  value: string;
  className?: string;
  placeholder?: string;
  disableFeatures?: RichEditorDisableFeatureT[];
  onChange: (newVal: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
};

export type RichEditor2T = {
  showImageDialog: () => void;
  showPollDialog: () => void;
  insertEmptyParagraph: () => void;
  setHtml: (html: string) => void;
  querySelectAll: (selectors: keyof HTMLElementTagNameMap) => null | NodeListOf<HTMLElement>;
};
