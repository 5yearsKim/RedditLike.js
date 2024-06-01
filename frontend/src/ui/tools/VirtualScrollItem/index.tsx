import React, { useEffect, useRef, useState, useCallback, CSSProperties, ReactNode } from "react";
import { useInView } from "react-intersection-observer";

interface VirtualScrollItemProps {
  children: JSX.Element;
  forceRender?: boolean;
  keepMountedAfterInitial?: boolean;
  minHeight?: number | string;
  divStyle?: CSSProperties;
  rootMargin?: string;
}

export function VirtualScrollItem({
  children,
  forceRender,
  keepMountedAfterInitial,
  minHeight,
  divStyle,
  rootMargin,
}: VirtualScrollItemProps): ReactNode {

  const ref = useRef<any>();
  const [elHeight, setElHeight] = useState<undefined | number>();
  const [onceLoaded, setOnceLoaded] = useState<boolean>(false);

  const { ref: inViewRef, inView } = useInView({
    rootMargin: rootMargin ?? "200px",
  });

  useEffect(() => {
    const height = ref.current?.clientHeight;
    if (height && height > (minHeight ?? 0)) {
      setElHeight(height);
    }
  }, [ref.current?.clientHeight]);

  useEffect(() => {
    if (inView) {
      setOnceLoaded(true);
    }
  }, [inView]);

  // https://www.npmjs.com/package/react-intersection-observer
  const setRefs = useCallback(
    (node: any) => {
      ref.current = node;
      inViewRef(node);
    },
    [inViewRef],
  );

  if (forceRender || (keepMountedAfterInitial && onceLoaded)) {
    return children;
  }

  return (
    <div
      style={divStyle}
      ref={setRefs}
    >
      {inView ? children : <div style={{ height: elHeight ?? minHeight }} />}
    </div>
  );
}
