import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ReadonlyURLSearchParams } from "next/navigation";

function searchParamsToMutable(searchParams: ReadonlyURLSearchParams): URLSearchParams{
  return new URLSearchParams(Array.from(searchParams.entries()));
}

export function useFocusComment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  function focusComment(commentId: idT): void {
    const sParams = searchParamsToMutable(searchParams);

    sParams.set("commentId", commentId.toString());
    router.replace(`${pathname}?${sParams.toString()}`, { scroll: false });
  }

  function unfocusComment(): void {
    const sParams = searchParamsToMutable(searchParams);
    if (!sParams.has("commentId")) {
      return;
    }
    sParams.delete("commentId");
    router.replace(`${pathname}?${sParams.toString()}`, { scroll: false });
  }

  function isCommentFocused(commentId: idT): boolean {
    return searchParams.get("commentId") == commentId.toString();
  }

  return {
    focusComment,
    unfocusComment,
    isCommentFocused,
  };
}
