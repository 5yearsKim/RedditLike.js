"use client";
import React from "react";
import FilerobotImageEditor, { TABS, TOOLS } from "react-filerobot-image-editor";
// import dynamic from "next/dynamic";

// const FilerobotImageEditor = dynamic(() => import("react-filerobot-image-editor"), { ssr: false });
// const TABS: any = dynamic(() => import("react-filerobot-image-editor").then((module) => module.TABS) as any, {
//   ssr: false,
// });
// const TOOLS: any = dynamic(() => import("react-filerobot-image-editor").then((module) => module.TOOLS) as any, {
//   ssr: false,
// });


import { savedImageData, uploadImageFromSavedImage } from "./utils";
import type { ImageT } from "@/types/Image";


type ImageEditorProps = {
  url: string;
  onSaved?: (imageBase64?: string) => void;
  onUploaded?: (uploaded: ImageT) => void;
  onCancel: (hasChanged: boolean) => void;
};


//https://github.com/scaleflex/filerobot-image-editor/issues/228

/** need to be imported by dynamic import */
export function ImageEditor({
  url,
  onSaved,
  onUploaded,
  onCancel,
}: ImageEditorProps): JSX.Element {

  async function handleSave(imageData: savedImageData): Promise<void> {
    try {
      if (onSaved) {
        onSaved(imageData.imageBase64);
      }
      if (onUploaded) {
        const newSaved = await uploadImageFromSavedImage(imageData);
        onUploaded(newSaved);
      }
    } catch (e) {
      console.warn(e);
    }
  }

  function handleClose(closeReason: string, hasChanged: boolean): void {
    console.log(closeReason);
    onCancel(hasChanged);
  }

  return (
    // <></>
    <FilerobotImageEditor
      savingPixelRatio={undefined as any}
      previewPixelRatio={undefined as any}
      // source={img}
      source={url}
      onSave={handleSave}
      onClose={handleClose}
      // annotationsCommon={{
      //   fill: '#ff0000',
      // }}
      Text={{ text: "Text" }}
      Rotate={{ angle: 90, componentType: "slider" }}
      tabsIds={[TABS.ADJUST, TABS.ANNOTATE, TABS.FILTERS, TABS.FINETUNE, TABS.WATERMARK]} // or {['Adjust', 'Annotate', 'Watermark']}
      // tabsIds={[TABS.ADJUST, TABS.ANNOTATE, TABS.FINETUNE ]} // or {['Adjust', 'Annotate', 'Watermark']}
      defaultTabId={TABS.ADJUST} // or 'Annotate'
      defaultToolId={TOOLS.TEXT} // or 'Text'
    />
  );
}

