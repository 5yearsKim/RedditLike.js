import React, { useEffect, useRef, useState, ReactNode } from "react";
import ReactPlayer from "react-player";
import type { VideoT } from "@/types/Video";
import { env } from "@/env";

type VideoPlayer2Props = {
  video: VideoT;
  width?: string | number;
  height?: string | number;
  autoPlay: "on" | "off" | "onScroll";
};

export function VideoPlayer2({
  video,
  width,
  height,
  autoPlay,
}: VideoPlayer2Props): ReactNode {

  const observerRef = useRef<HTMLDivElement | null>(null);

  const [playing, setPlaying] = useState<boolean>(autoPlay == "on");
  const [onceDetected, setOnceDetected] = useState<boolean>(false);

  useEffect(() => {
    if (autoPlay !== "onScroll") {
      return;
    }
    if (!observerRef.current) {
      return;
    }
    const observer = new IntersectionObserver(handleObserveVideo, {
      root: null,
      rootMargin: "-100px",
      threshold: 0,
    });
    observer.observe(observerRef.current);
    return (): void => {
      if (observerRef.current && observer) {
        observer.disconnect();
      }
    };
  }, [observerRef.current, onceDetected]);

  const handleObserveVideo: IntersectionObserverCallback = (entries) => {
    const target = entries[0];
    if (onceDetected) {
      return;
    }
    setOnceDetected(true);
    // console.log(target.isIntersecting);
    if (target.isIntersecting) {
      // scroll into view
      setPlaying(true);
    } else {
      setPlaying(false);
    }
  };

  // let mimeType: string|undefined = '';
  let src = "";

  if (video.converted_at && video.s_path) {
    src = new URL(video.s_path, env.RESOURCE_URL).toString();
    // mimeType = 'application/x-mpegURL';
  } else {
    let host = video.host ?? env.RESOURCE_URL;
    if (!host.startsWith("http://") && !host.startsWith("https://")) {
      host = "https://" + host;
    }
    src = new URL(video.path, host).toString();
  }

  return (
    <>
      <div ref={observerRef} />
      <ReactPlayer
        url={src}
        style={{ background: "#111111" }}
        playing={playing}
        muted
        controls
        width={width}
        height={height}
        // url={[{ src: src, type: mimeType }]}
      />
    </>
  );
}
