"use client";

import { useState, useEffect, useRef } from "react";

export function VideoSection() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
  const [isVideoHovered, setIsVideoHovered] = useState(false);

  const toggleSubtitles = () => {
    if (!videoRef.current) return;
    const newState = !subtitlesEnabled;
    const textTracks = videoRef.current.textTracks;
    if (textTracks && textTracks.length > 0) {
      for (let i = 0; i < textTracks.length; i++) {
        if (textTracks[i].kind === "subtitles" || textTracks[i].kind === "captions") {
          textTracks[i].mode = newState ? "showing" : "hidden";
        }
      }
    }
    setSubtitlesEnabled(newState);
  };

  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const handleLoadedMetadata = () => {
      const textTracks = video.textTracks;
      if (textTracks && textTracks.length > 0) {
        for (let i = 0; i < textTracks.length; i++) {
          const track = textTracks[i];
          if (track.kind === "subtitles" || track.kind === "captions") {
            track.mode = "showing";
            setSubtitlesEnabled(true);
          }
        }
      }
    };

    const timeoutId = setTimeout(() => {
      if (video.textTracks && video.textTracks.length > 0) {
        for (let i = 0; i < video.textTracks.length; i++) {
          if (video.textTracks[i].kind === "subtitles" || video.textTracks[i].kind === "captions") {
            video.textTracks[i].mode = "showing";
          }
        }
      }
    }, 500);

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () => {
      clearTimeout(timeoutId);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  return (
    <div
      className="video-container-wrapper"
      onMouseEnter={(e) => {
        const video = e.currentTarget.querySelector("video");
        if (video) video.controls = true;
        setIsVideoHovered(true);
      }}
      onMouseLeave={(e) => {
        const video = e.currentTarget.querySelector("video");
        if (video) video.controls = false;
        setIsVideoHovered(false);
      }}
    >
      <video
        ref={videoRef}
        className="video-element"
        width="100%"
        height="100%"
        autoPlay
        muted
        crossOrigin="anonymous"
      >
        <source
          src="https://cdn.builder.io/o/assets%2F5031849ff5814a4cae6f958ac9f10229%2Ff3b28b352ad0461ba487be029ca85fa4?alt=media&token=96924fb3-b2c5-49c6-bb22-1ad36aba0d90&apiKey=5031849ff5814a4cae6f958ac9f10229"
          type="video/mp4"
        />
        <track kind="subtitles" src="/aigt.vtt" srcLang="en" label="English" default />
        Your browser does not support the video tag.
      </video>
      <button
        onClick={toggleSubtitles}
        className={`video-subtitles-button ${isVideoHovered ? "video-subtitles-visible" : ""}`}
        aria-label={subtitlesEnabled ? "Disable subtitles" : "Enable subtitles"}
        title={subtitlesEnabled ? "Disable subtitles" : "Enable subtitles"}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4v-4H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <line x1="8" y1="10" x2="16" y2="10" />
          <line x1="8" y1="14" x2="13" y2="14" />
        </svg>
        <span className="video-subtitles-label">{subtitlesEnabled ? "CC On" : "CC Off"}</span>
      </button>
    </div>
  );
}
