import React from "react";
import { Metadata } from "next";
import { ConfigureAccountPage } from "@/$pages/ConfigureAccountPage";

export const metadata: Metadata = {
  title: "loading account..",
};

export default function ConfigureAccount(): JSX.Element {
  return (
    <ConfigureAccountPage/>
  );
}