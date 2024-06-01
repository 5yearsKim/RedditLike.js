import React from "react";
import { ManagingLayout } from "./layout";
import { ManagingRouter } from "./router";

export function ManagingPage(): JSX.Element {
  return (
    <ManagingLayout>
      <ManagingRouter />
    </ManagingLayout>
  );
}
