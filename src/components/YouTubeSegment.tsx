"use client";

import React from "react";

type YouTubeSegmentProps = {
  videoId: string;
  start?: number; // seconds
  end?: number;   // seconds
  title?: string; // accessible title / caption
};

export default function YouTubeSegment({ videoId, start, end, title }: YouTubeSegmentProps) {
  const params = new URLSearchParams({
    modestbranding: "1",
    rel: "0",
    enablejsapi: "1",
    playsinline: "1",
    ...(start ? { start: String(start) } : {}),
    ...(end ? { end: String(end) } : {}),
  });

  return (
    <figure className="w-full">
      <div className="relative w-full pt-[56.25%] rounded-xl overflow-hidden shadow">
        <iframe
          title={title ?? "Embedded YouTube segment"}
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${videoId}?${params.toString()}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      {title && (
        <figcaption className="mt-2 text-sm text-muted-foreground">
          {title}
        </figcaption>
      )}
    </figure>
  );
}
