import React from "react";
import {
  AbsoluteFill,
  Audio,
  staticFile,
  Sequence,
  useVideoConfig,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { InterviewScene } from "./scenes/InterviewScene";
import { CodeSetupScene } from "./scenes/CodeSetupScene";
import { FunctionCardsScene } from "./scenes/FunctionCardsScene";
import { TheRevealScene } from "./scenes/TheRevealScene";
import { OutroScene } from "./scenes/OutroScene";
import { Subtitles } from "./components/Subtitles";
import transcript from "./transcript.json";

export const EpisodeTwo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const scene1Start = Math.round((transcript[0].timestamp[0] ?? 0) * fps);
  const scene2Start = Math.round((transcript[4].timestamp[0] ?? 0) * fps);
  const scene3Start = Math.round((transcript[10].timestamp[0] ?? 0) * fps);
  const scene4Start = Math.round((transcript[15].timestamp[0] ?? 0) * fps);
  const scene5Start = Math.round((transcript[23].timestamp[0] ?? 0) * fps);

  const videoEnd = durationInFrames;

  // ==========================================
  // 🚀 CINEMATIC AUDIO MIXER
  // ==========================================

  // Anchor the music start to exactly when the Interviewer says "What are closures..."
  const bgmStartSeconds = transcript[1].timestamp[0] ?? 3.96;
  const bgmStartFrame = Math.round(bgmStartSeconds * fps);

  // 6.5 seconds for a long, atmospheric fade
  const fadeDurationFrames = Math.round(6.5 * fps);
  const maxBgmVolume = 0.04; // 4% volume

  const bgmVolume = interpolate(
    frame,
    [
      bgmStartFrame, // Start fading in at 3.96s
      bgmStartFrame + fadeDurationFrames, // Hits max volume ~10.46s
      durationInFrames - fadeDurationFrames, // Starts fading out 6.5s before the end
      durationInFrames, // Hits 0 exactly as the video ends
    ],
    [0, maxBgmVolume, maxBgmVolume, 0], // 0 -> 15% -> 15% -> 0
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }, // Clamps to 0 before start and after end
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0F19" }}>
      {/* 🚀 AUDIO LAYERS */}
      <Audio src={staticFile("combined.wav")} volume={1} />
      <Audio src={staticFile("bgm.mp3")} volume={bgmVolume} />

      {/* 👇 THE GLITCH SOUND EFFECT (Pinned to 1.8s, duration 1.0s) */}
      <Sequence from={Math.round(1.6 * fps)}>
        <Audio
          src={staticFile("glitch.wav")}
          volume={0.4}
          // STRICT CUTOFF: Forces the audio to stop exactly after 1 second
          endAt={1 * fps}
        />
      </Sequence>

      <Sequence from={scene1Start} durationInFrames={scene2Start - scene1Start}>
        <InterviewScene />
      </Sequence>

      <Sequence from={scene2Start} durationInFrames={scene3Start - scene2Start}>
        <CodeSetupScene />
      </Sequence>

      <Sequence from={scene3Start} durationInFrames={scene4Start - scene3Start}>
        <FunctionCardsScene />
      </Sequence>

      <Sequence from={scene4Start} durationInFrames={scene5Start - scene4Start}>
        <TheRevealScene />
      </Sequence>

      <Sequence from={scene5Start} durationInFrames={videoEnd - scene5Start}>
        <OutroScene />
      </Sequence>

      <Subtitles />
    </AbsoluteFill>
  );
};
