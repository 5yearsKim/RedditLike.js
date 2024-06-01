import type {
  AuthorT, UserT, BoardT, ImageT, VideoT,
  PostT, PostFormT, FlagT,
} from "@/types";

export type XPostDataT = {
  flags?: FlagT[];
  images?: ImageT[];
  videos?: VideoT[];
};

export type PostEditorT = {
  checkHasChanged: () => boolean;
  reset: () => void;
  // importFromCrawled: (crawled: CrawlResultT) => void;
};

export type PostEditorProps = {
  author: AuthorT;
  me: UserT;
  board: BoardT;
  isManager: boolean;
  post?: PostT;
  submitDisabled?: boolean;
  loadDraft?: boolean;
  saveDraft?: boolean;
  onSubmit: (form: PostFormT, xData: XPostDataT) => Promise<PostT | void>;
  onCancel?: (form: PostFormT, xData: XPostDataT) => any;
  onDraftSave: (form: PostFormT, xData: XPostDataT) => any;
};
