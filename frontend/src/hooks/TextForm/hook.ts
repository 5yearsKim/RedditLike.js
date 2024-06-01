"use client";

import { useState, useEffect, useMemo } from "react";
import { ValidatorT } from "@/utils/validator";

type TextFormOptions = {
  validators?: ValidatorT[];
  helpers?: ValidatorT[];
};

function _checkValidators(text: string, validators: ValidatorT[]): string | null {
  let err: string | null = null;
  for (const validator of validators) {
    err = validator(text);
    if (err) {
      return err;
    }
  }
  return null;
}

export function useTextForm(initText: string, options: TextFormOptions = {}) {
  const [val, _setVal] = useState<string>(initText);
  const [errText, setErrText] = useState<string | null>(null);
  const [helpText, setHelpText] = useState<string | null>(null);

  const isValid = useMemo(() => {
    const err = _checkValidators(val, options.validators ?? []);
    return err ? false : true;
  }, [val]);

  useEffect(() => {
    const help = _checkValidators(val, options.helpers ?? []);
    setHelpText(help);
  }, [val]);

  function setVal(text: string): void {
    const err = _checkValidators(text, options.validators ?? []);
    setErrText(err);
    _setVal(text);
  }

  return {
    val,
    isValid,
    errText,
    helpText,
    setVal,
  };
}
