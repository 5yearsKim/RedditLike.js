import React, { Fragment, ReactNode } from "react";
// import { ViewportList } from "react-viewport-list";
import { ViewObserver } from "@/ui/tools/ViewObserver";

export * from "./ui_tools";

type ListViewProps<ModelT> = {
  data: ModelT[];
  // viewportRef?: RefObject<HTMLDivElement>;
  onLoaderDetect: () => void;
  renderItem: (item: ModelT, idx: number) => ReactNode;
  renderAppend?: () => ReactNode;
};

export function ListView<ModelT extends BaseModelT>({
  data,
  onLoaderDetect,
  renderItem,
  renderAppend,
}: ListViewProps<ModelT>): ReactNode {

  // if (viewportRef) {
  //   return (
  //     <Fragment>
  //       <ViewportList
  //         viewportRef={viewportRef}
  //         items={data}
  //       >
  //         {(item, idx): JSX.Element => {
  //           return renderItem(item, idx);
  //         }}
  //       </ViewportList>

  //       <ViewObserver onDetect={onLoaderDetect} />
  //       {renderAppend && renderAppend()}
  //     </Fragment>
  //   );
  // }
  return (
    <Fragment>
      {data.map((item, idx) => renderItem(item, idx))}

      <ViewObserver
        onDetect={onLoaderDetect}
        monitoringArgs={[data]}
      />

      {renderAppend && renderAppend()}
    </Fragment>
  );
}

