import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { Header } from "../components/Header";

export const ConceptScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Motion Graphics: Sequential spring animations for the text
  const slideUp1 = spring({ frame: frame - 5, fps, config: { damping: 14 } });
  const slideUp2 = spring({ frame: frame - 15, fps, config: { damping: 14 } });
  const slideUp3 = spring({ frame: frame - 25, fps, config: { damping: 14 } });
  const slideUp4 = spring({ frame: frame - 40, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill>
      {/* Assuming background23.png contains your dark dotted background */}
      <Img
        src={staticFile("background23.png")}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          objectFit: "cover",
        }}
      />

      {/* Passing the dark theme to invert the header colors */}
      <Header theme="dark" />

      {/* Animated Typography Container */}
      <div
        style={{
          position: "absolute",
          top: "32%", // Pushed slightly up to balance the massive text
          left: "8%",
          width: "84%",
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          fontFamily: '"Poppins", sans-serif',
        }}
      >
        {/* TODAY'S CONCEPT */}
        <div
          style={{
            color: "#48C4D4",
            fontSize: "42px",
            fontWeight: 800,
            letterSpacing: "2px",
            opacity: slideUp1,
            transform: `translateY(${interpolate(slideUp1, [0, 1], [50, 0])}px)`,
          }}
        >
          TODAY'S CONCEPT
        </div>

        {/* Huge White Text */}
        <div
          style={{
            fontSize: "110px",
            fontWeight: 800,
            lineHeight: 1.1,
            color: "#FFFFFF",
            opacity: slideUp2,
            transform: `translateY(${interpolate(slideUp2, [0, 1], [50, 0])}px)`,
          }}
        >
          PYTHON
        </div>

        {/* Huge Golden Text */}
        <div
          style={{
            fontSize: "130px",
            fontWeight: 800,
            lineHeight: 1,
            color: "#D5A65B",
            opacity: slideUp3,
            transform: `translateY(${interpolate(slideUp3, [0, 1], [50, 0])}px)`,
          }}
        >
          CLOSURES
        </div>

        {/* White Description Text */}
        <div
          style={{
            marginTop: "60px",
            color: "#FFFFFF",
            fontSize: "56px",
            fontWeight: 700,
            lineHeight: 1.2,
            opacity: slideUp4,
            transform: `translateY(${interpolate(slideUp4, [0, 1], [30, 0])}px)`,
          }}
        >
          Functions bundled with
          <br />
          their environment.
        </div>
      </div>

      {/* 25% Subtitle Block (Remains static over the animation) */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: "25%",
          backgroundColor: "#172B45",
          zIndex: 30,
        }}
      />
    </AbsoluteFill>
  );
};
