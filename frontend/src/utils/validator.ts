import { checkUrl, countChar } from "./misc";

export type ValidatorT = (text: string) => string | null;
// [isErr, helperText]

export function noEmptyValidator(): ValidatorT {
  return (text: string): ReturnType<ValidatorT> => {
    if (text.length) {
      return null;
    }
    return "*";
  };
}

export function maxLenValidator(maxLen: number): ValidatorT {
  return (text: string): ReturnType<ValidatorT> => {
    // for efficiency
    if (text.length < maxLen / 2) {
      return null;
    }
    const cnt = countChar(text);
    if (cnt > maxLen) {
      return `${cnt}/${maxLen}`;
    } else {
      return null;
    }
  };
}

export function emailValidator(): ValidatorT {
  return (text: string): ReturnType<ValidatorT> => {
    const isMatch = String(text)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
    if (!isMatch) {
      return "Invalid email address";
    }
    return null;
  };
}

export function urlValidator(): ValidatorT {
  return (text: string): ReturnType<ValidatorT> => {
    const httpRgx = new RegExp("^(http|https)://");
    if (!httpRgx.test(text)) {
      return "missing https://";
    }
    if (!checkUrl(text)) {
      return "invalid url";
    }
    return null;
  };
}

export function charRemainingHelper(maxLen: number): ValidatorT {
  return (text: string): ReturnType<ValidatorT> => {
    const cnt = countChar(text);
    return `${cnt}/${maxLen}`;
  };
}
