import React from "react";
import { Composition, staticFile } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { EpisodeTwo } from "./EpisodeTwo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Episode02-Closures"
        component={EpisodeTwo}
        fps={30}
        width={1080}
        height={1920}
        durationInFrames={300}
        calculateMetadata={async ({ props }) => {
          const duration = await getAudioDurationInSeconds(
            staticFile("combined.wav"),
          );
          return {
            // 🚀 Adds exactly 2 seconds of breathing room at the end
            durationInFrames: Math.ceil(duration * 30) + 60,
            props,
          };
        }}
      />
    </>
  );
};
