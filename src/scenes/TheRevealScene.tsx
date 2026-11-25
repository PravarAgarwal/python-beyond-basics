import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  interpolateColors,
} from "remotion";
import { Header } from "../components/Header";
import transcript from "../transcript.json";

const GlitchText: React.FC<{
  text: string;
  startFrame: number;
  color?: string;
  delay?: number;
}> = ({ text, startFrame, color = "#FFFFFF", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  return (
    <div style={{ display: "inline-block", whiteSpace: "pre-wrap" }}>
      {words.map((word, i) => {
        const wordSpring = spring({
          frame: frame - startFrame - i * delay,
          fps,
          config: { damping: 10, stiffness: 200, mass: 0.8 },
        });
        const glitchOffset = interpolate(wordSpring, [0, 0.8, 1], [30, -10, 0]);
        const textShadow =
          wordSpring < 1
            ? `${glitchOffset}px 0px 0px rgba(255,0,0,0.7), -${glitchOffset}px 0px 0px rgba(0,255,255,0.7)`
            : "0 10px 20px rgba(0,0,0,0.5)";
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              color,
              marginRight: "15px",
              transform: `scale(${wordSpring}) translateY(${interpolate(wordSpring, [0, 1], [50, 0])}px)`,
              opacity: wordSpring,
              textShadow,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

const HolographicCore: React.FC<{ scale: number; color?: string }> = ({
  scale,
  color = "#00FFFF",
}) => {
  const frame = useCurrentFrame();
  const rotation = frame * 2.5;
  return (
    <div
      style={{
        width: "80px",
        height: "80px",
        transform: `scale(${scale})`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        perspective: "600px",
      }}
    >
      {[0, 60, 120].map((angle, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: "140%",
            height: "140%",
            border: `2px solid ${color === "#00FFFF" ? "rgba(0,255,255,0.4)" : "rgba(213,166,91,0.4)"}`,
            borderRadius: "50%",
            transform: `rotateX(75deg) rotateY(${angle}deg) rotateZ(${i % 2 === 0 ? rotation : -rotation}deg)`,
          }}
        />
      ))}
      <div
        style={{
          width: "30px",
          height: "30px",
          backgroundColor: color,
          transform: "rotate(45deg)",
          boxShadow: `0 0 40px ${color}, 0 0 80px ${color}`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: 0.9,
        }}
      >
        <div
          style={{
            width: "40%",
            height: "40%",
            border: "2px solid white",
            transform: "rotate(-45deg)",
          }}
        />
      </div>
    </div>
  );
};

const SpeakerHUD: React.FC<{
  name: string;
  active: boolean;
  color: string;
  align: "left" | "right";
  flareSpring?: number;
}> = ({ name, active, color, align, flareSpring = 0 }) => {
  const frame = useCurrentFrame();
  const pulse = active ? Math.sin(frame / 5) * 10 : 0;

  const flareScale = interpolate(flareSpring, [0, 0.5, 1], [1, 1.3, 1]);
  const flareGlow = interpolate(flareSpring, [0, 0.5, 1], [0, 80, 0]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: align === "left" ? "row" : "row-reverse",
        alignItems: "center",
        gap: "20px",
        opacity: active ? 1 : 0.4,
        transform: `scale(${active ? 1.05 * flareScale : 1})`,
        transition: "all 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
      }}
    >
      <div
        style={{
          width: "70px",
          height: "70px",
          borderRadius: "50%",
          backgroundColor: "rgba(30, 35, 46, 0.8)",
          backdropFilter: "blur(10px)",
          border: `3px solid ${active ? color : "#A9B7C6"}`,
          boxShadow: active
            ? `0 0 ${20 + pulse + flareGlow}px ${color}`
            : "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "4px",
            alignItems: "center",
            height: "30px",
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: "4px",
                backgroundColor: active ? color : "#A9B7C6",
                borderRadius: "2px",
                height: active ? `${10 + Math.random() * 20}px` : "4px",
                transition: "height 0.1s ease",
              }}
            />
          ))}
        </div>
      </div>
      <div
        style={{
          fontFamily: '"Poppins", sans-serif',
          fontSize: "35px",
          fontWeight: 800,
          color: active ? "#FFFFFF" : "#A9B7C6",
          textShadow: active ? `0 0 ${15 + flareGlow}px ${color}` : "none",
          textAlign: align,
        }}
      >
        {name}
      </div>
    </div>
  );
};

export const TheRevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneStart = transcript[15].timestamp[0] ?? 0;

  const SYNC = {
    interviewer1: 0,
    interviewee1: (transcript[16].timestamp[0] ?? 0) - sceneStart,
    shieldBoot: (transcript[17].timestamp[0] ?? 0) - sceneStart,

    narratorTakeover: (transcript[19].timestamp[0] ?? 0) - sceneStart,
    outerEradicated: (transcript[20].timestamp[0] ?? 0) - sceneStart,
    retainsAccess: (transcript[20].timestamp[0] ?? 0) - sceneStart + 3.0,

    closureText: (transcript[21].timestamp[0] ?? 0) - sceneStart,
    defText: (transcript[22].timestamp[0] ?? 0) - sceneStart,
  };

  const cameraScale = interpolate(frame, [0, 1200], [1, 1.15]);
  const localSeconds = frame / fps;

  const isLeftSpeakerActive =
    (localSeconds >= SYNC.interviewer1 && localSeconds < SYNC.interviewee1) ||
    localSeconds >= SYNC.narratorTakeover;
  const leftSpeakerName =
    localSeconds >= SYNC.narratorTakeover ? "NARRATOR" : "INTERVIEWER";
  const isIntervieweeActive =
    localSeconds >= SYNC.interviewee1 && localSeconds < SYNC.narratorTakeover;

  const cinematicConfig = { damping: 25, stiffness: 70, mass: 1.5 };

  const nodeBoot = spring({ frame, fps, config: cinematicConfig });
  const nodeDeath = spring({
    frame: frame - Math.round(SYNC.interviewee1 * fps),
    fps,
    config: { damping: 20, stiffness: 50, mass: 2 },
  });
  const shieldBoot = spring({
    frame: frame - Math.round(SYNC.shieldBoot * fps),
    fps,
    config: { damping: 15, stiffness: 120, mass: 1.2 },
  });

  const overrideSpring = spring({
    frame: frame - Math.round(SYNC.narratorTakeover * fps),
    fps,
    config: { damping: 18, stiffness: 100, mass: 1.2 },
  });
  const exactlyFlare = spring({
    frame: frame - Math.round(SYNC.narratorTakeover * fps),
    fps,
    config: { damping: 12, stiffness: 250, mass: 0.8 },
  });

  const eradicateSpring = spring({
    frame: frame - Math.round(SYNC.outerEradicated * fps),
    fps,
    config: { damping: 25, stiffness: 60, mass: 2 },
  });
  const tetherSpring = spring({
    frame: frame - Math.round(SYNC.retainsAccess * fps),
    fps,
    config: { damping: 20, stiffness: 80 },
  });

  const clearCenter = spring({
    frame: frame - Math.round(SYNC.closureText * fps),
    fps,
    config: { damping: 20, stiffness: 80 },
  });
  const closureTitle = spring({
    frame: frame - Math.round(SYNC.closureText * fps),
    fps,
    config: { damping: 12, stiffness: 150, mass: 1.5 },
  });

  const laserOffset = (frame * 15) % 1000;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0F19" }}>
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "0",
          width: "100%",
          height: "100px",
          zIndex: 50,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: interpolate(overrideSpring, [0, 1], [8, 50]) + "%",
            transform: `translateX(-${interpolate(overrideSpring, [0, 1], [0, 50])}%) scale(${interpolate(overrideSpring, [0, 1], [1, 1.4])})`,
            transition: "none",
          }}
        >
          <SpeakerHUD
            name={leftSpeakerName}
            active={isLeftSpeakerActive}
            color="#FFC66D"
            align="left"
            flareSpring={exactlyFlare}
          />
        </div>

        <div
          style={{
            position: "absolute",
            right: interpolate(overrideSpring, [0, 1], [8, -50]) + "%",
            opacity: interpolate(overrideSpring, [0, 1], [1, 0]),
            transition: "none",
          }}
        >
          <SpeakerHUD
            name="INTERVIEWEE"
            active={isIntervieweeActive}
            color="#00FFFF"
            align="right"
          />
        </div>
      </div>

      <AbsoluteFill
        style={{
          transform: `scale(${cameraScale})`,
          transformOrigin: "center center",
        }}
      >
        <Img
          src={staticFile("background23.png")}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            objectFit: "cover",
            opacity: 0.7,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: `rgba(0,0,0,${interpolate(overrideSpring, [0, 1], [0, 0.6])})`,
            zIndex: 1,
          }}
        />

        <AbsoluteFill
          style={{
            opacity: 1 - clearCenter,
            transform: `scale(${interpolate(clearCenter, [0, 1], [1, 3])}) translateY(${interpolate(clearCenter, [0, 1], [0, 100])}px)`,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 5,
          }}
        >
          {tetherSpring > 0 && (
            <svg
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                zIndex: 2,
              }}
            >
              <path
                d="M -200 800 Q 540 800, 540 960"
                fill="none"
                stroke="#D5A65B"
                strokeWidth="8"
                strokeDasharray="100 400"
                strokeDashoffset={-laserOffset}
                opacity={tetherSpring}
                style={{ filter: "drop-shadow(0px 0px 20px #D5A65B)" }}
              />
              <path
                d="M 1280 800 Q 540 800, 540 960"
                fill="none"
                stroke="#D5A65B"
                strokeWidth="8"
                strokeDasharray="100 400"
                strokeDashoffset={laserOffset}
                opacity={tetherSpring}
                style={{ filter: "drop-shadow(0px 0px 20px #D5A65B)" }}
              />
              <circle
                cx="540"
                cy="960"
                r={interpolate(tetherSpring, [0, 1], [0, 200])}
                fill="none"
                stroke="rgba(213,166,91,0.5)"
                strokeWidth="4"
                strokeDasharray="20 20"
                opacity={tetherSpring}
              />
            </svg>
          )}

          {tetherSpring > 0 && (
            <div
              style={{
                position: "absolute",
                top: "35%",
                opacity: tetherSpring,
                fontFamily: '"Consolas", monospace',
                fontSize: "40px",
                color: "#D5A65B",
                textShadow: "0 0 20px #D5A65B",
                zIndex: 10,
              }}
            >
              inner_function() scope
            </div>
          )}

          <div
            style={{
              width: "350px",
              height: "350px",
              borderRadius: "50%",
              backgroundColor: interpolateColors(
                nodeDeath,
                [0, 1],
                ["rgba(30, 35, 46, 0.6)", "rgba(15, 17, 23, 0.3)"],
              ),
              backdropFilter: `blur(${interpolate(nodeDeath, [0, 1], [20, 5])}px)`,
              border: `4px dashed ${interpolateColors(nodeDeath, [0, 1], ["rgba(72, 196, 212, 0.4)", "rgba(72, 196, 212, 0.05)"])}`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transform: `scale(${interpolate(nodeBoot, [0, 1], [0, 1]) + interpolate(eradicateSpring, [0, 1], [0, 2])}) translateY(${Math.sin(frame / 20) * 10}px)`,
              opacity: interpolate(eradicateSpring, [0, 1], [1, 0]),
              filter: `grayscale(${interpolate(nodeDeath, [0, 1], [0, 100])}%)`,
            }}
          />

          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) translateY(${Math.sin(frame / 20) * 10}px) scale(${1 + shieldBoot * 0.2})`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 20,
            }}
          >
            {shieldBoot > 0 && (
              <div
                style={{
                  position: "absolute",
                  width: "220px",
                  height: "220px",
                  borderRadius: "50%",
                  border: "4px solid #00FFFF",
                  backgroundColor: "rgba(0, 255, 255, 0.1)",
                  backdropFilter: "blur(5px)",
                  boxShadow:
                    "inset 0 0 50px rgba(0,255,255,0.5), 0 0 60px rgba(0,255,255,0.3)",
                  transform: `scale(${interpolate(shieldBoot, [0, 1], [0.1, 1])})`,
                  opacity: shieldBoot,
                  zIndex: 10,
                }}
              />
            )}
            <div style={{ zIndex: 5 }}>
              <HolographicCore
                scale={interpolate(nodeBoot, [0, 1], [0, 1.2])}
                color="#00FFFF"
              />
            </div>
          </div>
        </AbsoluteFill>

        {/* ✨ FIX: Shifted the title up to 32% to close the gap */}
        <div
          style={{
            position: "absolute",
            top: "32%",
            left: "0",
            width: "100%",
            zIndex: 30,
            textAlign: "center",
            transform: `scale(${interpolate(closureTitle, [0, 1], [3, 1])})`,
            opacity: closureTitle,
          }}
        >
          {frame >= Math.round(SYNC.closureText * fps) && (
            <div
              style={{
                fontFamily: '"Poppins", sans-serif',
                fontSize: "140px",
                fontWeight: 900,
                color: "#FFFFFF",
                textShadow: "0 20px 40px rgba(0,0,0,0.8)",
              }}
            >
              CLOSURE
            </div>
          )}
        </div>

        {/* ✨ FIX: Lifted the definition to 48%, narrowed the width, added boxSizing, and slightly reduced font size for a perfect fit */}
        <div
          style={{
            position: "absolute",
            top: "48%",
            left: "7.5%",
            width: "85%",
            zIndex: 30,
            textAlign: "center",
            fontFamily: '"Poppins", sans-serif',
            fontSize: "42px",
            fontWeight: 700,
            lineHeight: 1.5,
            boxSizing: "border-box",
          }}
        >
          {frame >= Math.round(SYNC.defText * fps) && (
            <div
              style={{
                backgroundColor: "rgba(30, 35, 46, 0.8)",
                padding: "40px",
                borderRadius: "30px",
                border: "3px solid #48C4D4",
                boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
                boxSizing: "border-box",
                width: "100%",
              }}
            >
              <GlitchText
                text="A function bundled with access to variables from its enclosing scope."
                startFrame={Math.round(SYNC.defText * fps)}
                delay={2}
                color="#A9B7C6"
              />
            </div>
          )}
        </div>
      </AbsoluteFill>
      <Header theme="dark" />
    </AbsoluteFill>
  );
};
