import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import transcript from "../transcript.json";

export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // This variable MUST be inside the component!
  const currentSeconds = frame / fps;

  // 🚀 DATA-DRIVEN ROUTING
  const isSubtitleActive =
    currentSeconds <= 35.5 ||
    (currentSeconds >= 40.0 && currentSeconds < 46.6) ||
    (currentSeconds >= 53.0 && currentSeconds < 79.6) ||
    (currentSeconds >= 84.8 && currentSeconds < 93.16);

  const activeIndex = transcript.findIndex((t: any, i: number) => {
    const baseStartTime = t.timestamp[0] ?? 0;
    const baseEndTime = t.timestamp[1];

    // THE TIMING FIX: Bumped to 0.9 seconds for a slightly longer breath
    const delayInSeconds = 0.9;

    const startTime = i === 3 ? baseStartTime + delayInSeconds : baseStartTime;
    const endTime =
      i === 2 && baseEndTime !== null
        ? baseEndTime + delayInSeconds
        : baseEndTime;

    return (
      i >= 1 &&
      isSubtitleActive &&
      currentSeconds >= startTime &&
      (endTime === null || currentSeconds < endTime)
    );
  });

  if (activeIndex === -1) return null;

  const activeLine = transcript[activeIndex];
  const lineStartFrame = Math.round((activeLine.timestamp[0] ?? 0) * fps);

  const entrySpring = spring({
    frame: frame - lineStartFrame,
    fps,
    config: { damping: 16, stiffness: 200, mass: 1.2 },
  });

  const isInterviewee = [2, 3, 16, 17, 18, 23].indexOf(activeIndex) !== -1;
  const isInterviewer =
    [1, 4, 5, 6, 15, 19, 20, 21, 24, 25].indexOf(activeIndex) !== -1;

  const themeColor = isInterviewee
    ? "#00FFFF"
    : isInterviewer
      ? "#FFC66D"
      : "#48C4D4";

  const highlightWords = [
    "closures",
    "python",
    "functions",
    "function",
    "multiply",
    "doubles",
    "triples",
    "factor",
    "inner",
    "outer",
    "variable",
    "call",
    "remembers",
    "two",
    "three",
    "executing",
    "accessible",
    "returns",
    "retains",
    "access",
    "variables",
    "enclosing",
    "scope",
    "closure",
    "clever",
    "interesting",
    "question",
  ];

  const startTime = activeLine.timestamp[0] ?? 0;
  const endTime = activeLine.timestamp[1] ?? startTime + 2;
  const durationFrames = (endTime - startTime) * fps;

  const words = activeLine.text.trim().split(/\s+/);
  const staggerFrames = (durationFrames * 0.75) / words.length;

  const renderWord = (word: string, i: number) => {
    const cleanWord = word.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    const isHighlight = highlightWords.indexOf(cleanWord) !== -1;

    const wordStartFrame = lineStartFrame + i * staggerFrames;
    const wordPop = spring({
      frame: frame - wordStartFrame,
      fps,
      config: { damping: 15, stiffness: 250 },
    });

    return (
      <span
        key={i}
        style={{
          color: isHighlight ? themeColor : "#FFFFFF",
          textShadow: isHighlight
            ? `0 0 20px ${themeColor}80`
            : "0 5px 15px rgba(0,0,0,0.8)",
          transform: `scale(${interpolate(wordPop, [0, 1], [0.5, 1])}) translateY(${interpolate(wordPop, [0, 1], [10, 0])}px)`,
          opacity: wordPop,
          display: "inline-block",
        }}
      >
        {word}
      </span>
    );
  };

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: "27%",
        pointerEvents: "none",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          transform: `scale(${interpolate(entrySpring, [0, 1], [0.95, 1])}) translateY(${interpolate(entrySpring, [0, 1], [20, 0])}px)`,
          opacity: entrySpring,
          width: "90%",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "12px 18px",
          boxSizing: "border-box",
          fontFamily: '"Poppins", sans-serif',
          fontSize: "52px",
          fontWeight: 800,
          lineHeight: 1.2,
          backgroundColor: "rgba(11, 15, 25, 0.85)",
          backdropFilter: "blur(20px)",
          border: `2px solid rgba(255, 255, 255, 0.05)`,
          borderBottom: `6px solid ${themeColor}`,
          padding: "30px 40px",
          borderRadius: "30px",
          boxShadow: `0 30px 60px rgba(0,0,0,0.6), 0 0 40px ${themeColor}20`,
        }}
      >
        {words.map(renderWord)}
      </div>
    </AbsoluteFill>
  );
};
