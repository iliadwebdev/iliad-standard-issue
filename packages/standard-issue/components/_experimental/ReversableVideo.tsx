"use client";

import React, { useRef, useEffect } from "react";
import { useMergedRef } from "@mantine/hooks";

// Types
type VideoProps = JSX.IntrinsicElements["video"];

export type ReversableVideoComponentProps = VideoProps & {
  reverseFramerate?: number;
  playbackRate?: number;
};

console.warn(
  `[Iliad] ReversableVideo: This component is marked as unstable and experimental.`
);

const ReversableVideo = React.forwardRef<
  HTMLVideoElement,
  ReversableVideoComponentProps
>(({ playbackRate = 1, reverseFramerate = 30, children, ...props }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mergedRef = useMergedRef(videoRef, ref);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let reverseInterval: number | null = null;

    const startReversePlayback = () => {
      if (reverseInterval !== null) return; // Already running
      if (playbackRate >= 0) return; // Playback rate is positive
      video.pause();
      reverseInterval = window.setInterval(() => {
        if (video.currentTime <= 0) {
          clearInterval(reverseInterval!);
          reverseInterval = null;
          video.currentTime = 0;
          video.pause();
        } else {
          // Adjust the decrement value based on the desired playback rate
          const decrement = Math.abs(playbackRate) / reverseFramerate;
          video.currentTime -= decrement;
        }
      }, 1000 / reverseFramerate); // Run at the specified reverse framerate
    };

    const stopReversePlayback = () => {
      if (reverseInterval !== null) {
        clearInterval(reverseInterval);
        reverseInterval = null;
      }
    };

    if (playbackRate < 0) {
      startReversePlayback();
    } else {
      stopReversePlayback();
      video.playbackRate = playbackRate;
      if (video.paused) {
        video.play();
      }
    }

    // Cleanup on unmount or when playbackRate or reverseFramerate changes
    return () => {
      stopReversePlayback();
    };
  }, [playbackRate, reverseFramerate]);

  return (
    <video ref={mergedRef} {...props}>
      {children}
    </video>
  );
});

ReversableVideo.displayName = "ReversableVideo";

export default ReversableVideo;
export { ReversableVideo };
