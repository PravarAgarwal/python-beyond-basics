import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  random,
} from "remotion";
import { Header } from "../components/Header";
import transcript from "../transcript.json";

// ==========================================
// 🚀 KINETIC TYPOGRAPHY
// ==========================================
const SlicedText: React.FC<{
  text: string;
  startFrame: number;
  color?: string;
  fontSize?: string;
}> = ({ text, startFrame, color = "#FFFFFF", fontSize = "60px" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const reveal = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 14, stiffness: 180, mass: 1 },
  });
  const thrust = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 20, stiffness: 80, mass: 1.5 },
  });

  return (
    <div
      style={{
        fontFamily: '"Poppins", sans-serif',
        fontSize,
        fontWeight: 900,
        color,
        clipPath: `inset(0 ${interpolate(reveal, [0, 1], [100, 0])}% 0 0)`,
        transform: `translateX(${interpolate(thrust, [0, 1], [-50, 0])}px) scale(${interpolate(reveal, [0, 1], [1.2, 1])})`,
        textShadow: `0 10px 30px rgba(0,0,0,0.8), -10px 0 20px ${color}40`,
        whiteSpace: "nowrap",
        lineHeight: 1.1,
      }}
    >
      {text}
    </div>
  );
};

// Left-aligned staggered slam for the End Slate
const StaggeredSlam: React.FC<{
  text: string;
  startFrame: number;
  color?: string;
}> = ({ text, startFrame, color = "#FFC66D" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const letters = text.split("");

  return (
    <div
      style={{
        display: "flex",
        gap: "4px",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      {letters.map((char, i) => {
        const slam = spring({
          frame: frame - (startFrame + i * 2),
          fps,
          config: { damping: 12, stiffness: 250, mass: 1.2 },
        });
        return (
          <span
            key={i}
            style={{
              fontFamily: '"Poppins", sans-serif',
              fontSize: "110px",
              fontWeight: 900,
              color,
              transform: `scale(${interpolate(slam, [0, 1], [3, 1])}) translateY(${interpolate(slam, [0, 1], [-50, 0])}px)`,
              opacity: slam,
              textShadow:
                slam < 1 ? `0 0 50px ${color}` : `0 20px 40px rgba(0,0,0,0.8)`,
              display: "inline-block",
              letterSpacing: "2px",
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};

// ==========================================
// 🚀 INTERVIEW HUD
// ==========================================
const SpeakerHUD: React.FC<{
  name: string;
  active: boolean;
  color: string;
  align: "left" | "right";
  shutdownSpring: number;
}> = ({ name, active, color, align, shutdownSpring }) => {
  const frame = useCurrentFrame();
  const pulse = active ? Math.sin(frame / 5) * 10 : 0;
  const glitchX =
    shutdownSpring > 0 && shutdownSpring < 1 ? (random(frame) - 0.5) * 40 : 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: align === "left" ? "row" : "row-reverse",
        alignItems: "center",
        gap: "20px",
        opacity: interpolate(shutdownSpring, [0, 1], [active ? 1 : 0.4, 0]),
        transform: `scale(${active ? 1.05 : 1}) translate(${glitchX}px, ${interpolate(shutdownSpring, [0, 1], [0, 100])}px)`,
        transition:
          shutdownSpring === 0
            ? "all 0.3s cubic-bezier(0.25, 1, 0.5, 1)"
            : "none",
        filter:
          shutdownSpring > 0 && shutdownSpring < 1
            ? `hue-rotate(${random(frame + 1) * 360}deg)`
            : "none",
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
          boxShadow: active ? `0 0 ${20 + pulse}px ${color}` : "none",
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
          textAlign: align,
        }}
      >
        {name}
      </div>
    </div>
  );
};

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneStart = transcript[23].timestamp[0] ?? 0;

  // 🚀 RE-CALIBRATED AUDIO SYNC FOR PERFECT PACING
  const SYNC = {
    intervieweeReturns: 0,
    interviewerReacts: (transcript[24].timestamp[0] ?? 0) - sceneStart,
    interviewerWrap: (transcript[25].timestamp[0] ?? 0) - sceneStart,

    narratorHook: (transcript[26].timestamp[0] ?? 0) - sceneStart, // 93.16s
    hookP1: (transcript[26].timestamp[0] ?? 0) - sceneStart + 1.8, // Delayed to match "to add functionality..."
    hookP2: (transcript[26].timestamp[0] ?? 0) - sceneStart + 4.0, // Delayed to match "...without changing code"
    hookClear: (transcript[26].timestamp[0] ?? 0) - sceneStart + 5.8, // Clears on "That's where..."
    hookClimax: (transcript[26].timestamp[0] ?? 0) - sceneStart + 7.0, // Slams on "...decorators come in"
  };

  const localSeconds = frame / fps;
  const isInterviewee =
    localSeconds >= SYNC.intervieweeReturns &&
    localSeconds < SYNC.interviewerReacts;
  const isInterviewer =
    localSeconds >= SYNC.interviewerReacts && localSeconds < SYNC.narratorHook;

  const narratorReset = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 80, mass: 1.2 },
  });
  const intervieweeReturn = spring({
    frame: frame - 10,
    fps,
    config: { damping: 15, stiffness: 100, mass: 1.2 },
  });

  const hologramPowerDown = spring({
    frame: frame - Math.round(SYNC.interviewerWrap * fps),
    fps,
    config: { damping: 20, stiffness: 60 },
  });
  const systemOverride = spring({
    frame: frame - Math.round(SYNC.narratorHook * fps),
    fps,
    config: { damping: 20, stiffness: 150, mass: 1.2 },
  });
  const clearVacuum = spring({
    frame: frame - Math.round(SYNC.hookClear * fps),
    fps,
    config: { damping: 20, stiffness: 80, mass: 1.5 },
  });

  const ringRotation = frame * 0.5;
  const endSlateBoot = spring({
    frame: frame - Math.round(SYNC.hookClimax * fps),
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0F19" }}>
      {/* 🚀 HUD LAYER */}
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
            left: interpolate(narratorReset, [0, 1], [50, 8]) + "%",
            transform: `translateX(-${interpolate(narratorReset, [0, 1], [50, 0])}%) scale(${interpolate(narratorReset, [0, 1], [1.4, 1])})`,
          }}
        >
          <SpeakerHUD
            name="INTERVIEWER"
            active={isInterviewer}
            color="#FFC66D"
            align="left"
            shutdownSpring={systemOverride}
          />
        </div>
        <div
          style={{
            position: "absolute",
            right: interpolate(intervieweeReturn, [0, 1], [-50, 8]) + "%",
            opacity: interpolate(intervieweeReturn, [0, 1], [0, 1]),
          }}
        >
          <SpeakerHUD
            name="INTERVIEWEE"
            active={isInterviewee}
            color="#00FFFF"
            align="right"
            shutdownSpring={systemOverride}
          />
        </div>
      </div>

      <AbsoluteFill
        style={{
          transform: `scale(${interpolate(frame, [0, 700], [1, 1.05])})`,
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

        {/* ========================================== */}
        {/* 🚀 HOLOGRAPHIC TABLE */}
        {/* ========================================== */}
        <div
          style={{
            position: "absolute",
            top: "55%",
            left: "50%",
            transform: `translate(-50%, -50%) perspective(1000px) rotateX(65deg) scale(${interpolate(hologramPowerDown, [0, 1], [1, 0.5]) - interpolate(systemOverride, [0, 1], [0, 2])})`,
            opacity: 1 - systemOverride,
            width: "600px",
            height: "600px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 5,
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              border: `2px dashed rgba(72,196,212,${interpolate(hologramPowerDown, [0, 1], [0.3, 0.05])})`,
              transform: `rotateZ(${ringRotation}deg)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              width: "70%",
              height: "70%",
              borderRadius: "50%",
              border: `4px solid rgba(255,198,109,${interpolate(hologramPowerDown, [0, 1], [0.2, 0.05])})`,
              transform: `rotateZ(-${ringRotation * 1.5}deg)`,
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: `rgba(0,0,0,${interpolate(systemOverride, [0, 1], [0, 0.85])})`,
            zIndex: 15,
          }}
        />

        {/* ========================================== */}
        {/* 🚀 KINETIC SLICES */}
        {/* ========================================== */}
        <div
          style={{
            position: "absolute",
            top: "45%",
            left: "0",
            width: "100%",
            zIndex: 40,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            transform: `scale(${interpolate(clearVacuum, [0, 1], [1, 4])})`,
            opacity: 1 - clearVacuum,
          }}
        >
          {frame >= Math.round(SYNC.hookP1 * fps) && (
            <SlicedText
              text="ADD FUNCTIONALITY"
              startFrame={Math.round(SYNC.hookP1 * fps)}
              color="#FFFFFF"
              fontSize="70px"
            />
          )}
          {frame >= Math.round(SYNC.hookP2 * fps) && (
            <SlicedText
              text="WITHOUT CHANGING CODE"
              startFrame={Math.round(SYNC.hookP2 * fps)}
              color="#48C4D4"
              fontSize="60px"
            />
          )}
        </div>

        {/* ========================================== */}
        {/* 🚀 THE "NEXT EPISODE" END SLATE */}
        {/* ========================================== */}
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "10%",
            zIndex: 50,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            opacity: endSlateBoot,
          }}
        >
          {frame >= Math.round(SYNC.hookClimax * fps) && (
            <>
              {/* Cyan Next Episode Label */}
              <div
                style={{
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: "45px",
                  fontWeight: 800,
                  color: "#48C4D4",
                  letterSpacing: "2px",
                  marginBottom: "-10px",
                  transform: `translateX(${interpolate(endSlateBoot, [0, 1], [-50, 0])}px)`,
                }}
              >
                NEXT EPISODE
              </div>

              {/* Yellow Subject Slam */}
              <StaggeredSlam
                text="DECORATORS"
                startFrame={Math.round(SYNC.hookClimax * fps)}
                color="#FFC66D"
              />

              {/* White Subtitle with Emoji */}
              <div
                style={{
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: "55px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  marginTop: "15px",
                  lineHeight: 1.2,
                  transform: `translateY(${interpolate(endSlateBoot, [0, 1], [30, 0])}px)`,
                }}
              >
                Python's Function
                <br />
                Superpowers ⚡
              </div>
            </>
          )}
        </div>
      </AbsoluteFill>
      <Header theme="dark" />
    </AbsoluteFill>
  );
};
