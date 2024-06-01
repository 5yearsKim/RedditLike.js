"use client";
import React, { useRef, useEffect, ReactNode } from "react";

type ViewObserverProps = {
  onDetect: () => any;
  rootMargin?: string;
  children?: ReactNode;
  monitoringArgs?: any[];
};

export function ViewObserver({
  onDetect,
  rootMargin,
  children,
  monitoringArgs,
}: ViewObserverProps): ReactNode {

  const loaderRef = useRef<null | HTMLDivElement>(null);

  const handleObserver: IntersectionObserverCallback = (entries) => {
    const target = entries[0];
    // console.log(target.isIntersecting);
    if (target.isIntersecting) {
      onDetect();
    }
  };

  useEffect(() => {
    if (!loaderRef.current) {
      return;
    }
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin,
      threshold: 0,
    });
    observer.observe(loaderRef.current);
    return (): void => {
      if (loaderRef.current && observer) {
        observer.disconnect();
      }
    };
  }, monitoringArgs ?? []);

  return <div ref={loaderRef}>{children}</div>;
}
