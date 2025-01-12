"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Icons } from "../Icons";

export function WelcomeVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const [isPlaying, setPlaying] = useState<boolean>(true);
  const [isMuted, setMuted] = useState<boolean>(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      video.load();
    }
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play();
    }

    setPlaying((prev) => !prev);
  };

  const toggleMute = () => {
    setMuted((prev) => !prev);
  };

  return (
    <motion.div
      className="flex flex-col justify-center px-20 max-w-5xl mx-auto"
      onViewportEnter={() => {
        if (!isPlaying && isDesktop) {
          timer.current = setTimeout(() => {
            videoRef.current?.play();
            setPlaying(true);
          }, 4000);
        }
      }}
      onViewportLeave={() => {
        videoRef.current?.pause();
        setPlaying(false);
        if (timer.current) {
          clearTimeout(timer.current);
        }
      }}
    >
      <div className="relative aspect-video w-full">
        {isPlaying && (
          <div className="absolute md:top-12 md:right-12 top-4 right-4 space-x-4 items-center justify-center z-30 transition-all">
            <Button
              size="icon"
              className="rounded-full size-10 md:size-14 transition ease-in-out hover:scale-110"
              onClick={toggleMute}
            >
              {isMuted ? (
                <Icons.mute className="w-5 h-5" />
              ) : (
                <Icons.unmute className="w-5 h-5" />
              )}
            </Button>
          </div>
        )}

        {!isPlaying && (
          <div className="absolute md:top-12 md:right-12 top-4 right-4 space-x-4 items-center justify-center z-30 transition-all">
            <Button
              size="icon"
              className="rounded-full size-10 md:size-14 transition ease-in-out hover:scale-110"
              onClick={togglePlay}
            >
              <Icons.play className="w-5 h-5" />
            </Button>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay={false}
          poster="https://cdn.midday.ai/poster.webp"
          className="w-full h-full object-cover"
          muted={isMuted}
          controls={false}
          onEnded={() => {
            videoRef.current?.load();
          }}
          onClick={togglePlay}
        >
          <source src="/welocme_video.mp4" type="video/mp4" />
        </video>
      </div>
    </motion.div>
  );
}
