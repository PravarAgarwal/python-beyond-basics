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
// 🚀 THE SNAP-BOOT AVATAR HUD
// ==========================================
const SpeakerHUD: React.FC<{
  name: string;
  active: boolean;
  color: string;
  align: "left" | "right";
  imgSrc: string;
  bootSpring: number;
}> = ({ name, active, color, align, imgSrc, bootSpring }) => {
  const frame = useCurrentFrame();
  const pulse = active ? Math.sin(frame / 5) * 10 : 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: align === "left" ? "row" : "row-reverse",
        alignItems: "center",
        gap: "20px",
        opacity: interpolate(bootSpring, [0, 1], [0, active ? 1 : 0.4]),
        // 🚀 HUD violently scales up from 0 to 1 while shifting slightly inward for a "snap" effect
        transform: `scale(${interpolate(bootSpring, [0, 1], [0.01, active ? 1.05 : 1])}) translateX(${interpolate(bootSpring, [0, 1], [align === "left" ? -50 : 50, 0])}px)`,
        transition:
          bootSpring === 1 ? "all 0.3s cubic-bezier(0.25, 1, 0.5, 1)" : "none",
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
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile(imgSrc)}
          style={{
            width: "120%",
            height: "120%",
            objectFit: "cover",
            objectPosition: "center 10%",
          }}
        />
      </div>
      <div
        style={{
          fontFamily: '"Poppins", sans-serif',
          fontSize: "35px",
          fontWeight: 800,
          color: active ? "#FFFFFF" : "#A9B7C6",
          textShadow: active ? `0 0 15px ${color}` : "none",
          textAlign: align,
        }}
      >
        {name}
      </div>
    </div>
  );
};

export const InterviewScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ==========================================
  // ⏱️ AUDIO SYNC TIMINGS
  // ==========================================
  const SYNC = {
    glitchStart: 2.0,
    topicDrop: transcript[1].timestamp[0] ?? 3.96,
    interviewee1: 6.0,
    interviewer2: transcript[4].timestamp[0] ?? 12.96,
  };

  const glitchStartFrame = Math.round(SYNC.glitchStart * fps);

  // 🚀 HARD CUT LOGIC
  // 6 frames of total chaos. At frame 3, we instantly cut to the dark room.
  const isLightMode = frame < glitchStartFrame;
  const isGlitching =
    frame >= glitchStartFrame && frame <= glitchStartFrame + 6;
  const isDarkMode = frame >= glitchStartFrame + 3;

  const localSeconds = frame / fps;
  const isInterviewer =
    (localSeconds >= 0 && localSeconds < SYNC.interviewee1) ||
    localSeconds >= SYNC.interviewer2;
  const isInterviewee =
    localSeconds >= SYNC.interviewee1 && localSeconds < SYNC.interviewer2;

  // ==========================================
  // 🚀 PHYSICS ENGINE
  // ==========================================

  // The dark room fades in rapidly mid-glitch
  const darkRoomBoot = spring({
    frame: frame - (glitchStartFrame + 3),
    fps,
    config: { damping: 15, stiffness: 200 },
  });

  // The Interviewer HUD violently slams onto the screen as soon as the dark room activates
  const interviewerSlam = spring({
    frame: frame - (glitchStartFrame + 3),
    fps,
    config: { damping: 12, stiffness: 220, mass: 1 },
  });

  // The Interviewee slides in later when they actually speak
  const intervieweeEnter = spring({
    frame: frame - Math.round(SYNC.interviewee1 * fps),
    fps,
    config: { damping: 16, stiffness: 100 },
  });

  // Hologram Physics
  const cameraScale = interpolate(frame, [0, 700], [1, 1.1]);
  const ringRotation = frame * 0.5;
  const topicBoot = spring({
    frame: frame - Math.round(SYNC.topicDrop * fps),
    fps,
    config: { damping: 15, stiffness: 100, mass: 1.2 },
  });

  // Violent Glitch Math
  const gOffsetX = isGlitching ? (random(frame) - 0.5) * 120 : 0;
  const gOffsetY = isGlitching ? (random(frame + 1) - 0.5) * 120 : 0;
  const gFilter =
    isGlitching && frame % 2 === 0
      ? "invert(100%) hue-rotate(90deg) contrast(200%)"
      : "none";

  return (
    <AbsoluteFill
      style={{ backgroundColor: isDarkMode ? "#0B0F19" : "#F0F4F8" }}
    >
      {/* ========================================== */}
      {/* 🚀 STAGE 1: THE FAKE-OUT (Deleted instantly mid-glitch) */}
      {/* ========================================== */}
      {(!isDarkMode || isGlitching) && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            transform: `translate(${gOffsetX}px, ${gOffsetY}px) scale(${isGlitching ? 1.1 : 1})`,
            filter: gFilter,
            opacity: isDarkMode ? 0 : 1, // Instantly turns off when dark mode triggers
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-10%",
              right: "-20%",
              width: "700px",
              height: "700px",
              backgroundColor: "#65B9D1",
              borderRadius: "50%",
              opacity: 0.4,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "10%",
              left: "-10%",
              width: "500px",
              height: "500px",
              backgroundColor: "#65B9D1",
              borderRadius: "50%",
              opacity: 0.3,
            }}
          />

          <div
            style={{
              position: "absolute",
              top: "22%",
              backgroundColor: "#FFFFFF",
              padding: "40px 60px",
              borderRadius: "40px",
              border: "3px solid #E1E8ED",
              boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
              fontFamily: '"Poppins", sans-serif',
              fontSize: "50px",
              fontWeight: 800,
              color: "#172B45",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "25px",
                color: "#D5A65B",
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: "10px",
              }}
            >
              The Interview Question
            </div>
            Alright, let's move on...
          </div>

          {/* Full body character deleted in the snap */}
          <div
            style={{
              position: "absolute",
              bottom: "-2%",
              height: "65%",
              zIndex: 40,
            }}
          >
            <Img
              src={staticFile("interviewer.png")}
              style={{ height: "100%", objectFit: "contain" }}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* ========================================== */}
      {/* 🚀 STAGE 2: THE DARK ROOM HOLOGRAM */}
      {/* ========================================== */}
      {isDarkMode && (
        <AbsoluteFill style={{ opacity: darkRoomBoot }}>
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

            {/* 🚀 THE HUD HARDWARE BOOT */}
            <div
              style={{
                position: "absolute",
                top: "15%",
                left: "0",
                width: "100%",
                padding: "0 8%",
                display: "flex",
                justifyContent: "space-between",
                zIndex: 50,
              }}
            >
              <SpeakerHUD
                name="INTERVIEWER"
                active={isInterviewer}
                color="#FFC66D"
                align="left"
                imgSrc="interviewer.png"
                bootSpring={interviewerSlam}
              />
              <SpeakerHUD
                name="INTERVIEWEE"
                active={isInterviewee}
                color="#00FFFF"
                align="right"
                imgSrc="interviewee.png"
                bootSpring={intervieweeEnter}
              />
            </div>

            {/* THE HOLOGRAPHIC BRIEFING TABLE */}
            <div
              style={{
                position: "absolute",
                top: "55%",
                left: "50%",
                transform: `translate(-50%, -50%) perspective(1000px) rotateX(65deg)`,
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
                  border: "2px dashed rgba(72,196,212,0.3)",
                  transform: `rotateZ(${ringRotation}deg)`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: "70%",
                  height: "70%",
                  borderRadius: "50%",
                  border: "4px solid rgba(255,198,109,0.2)",
                  transform: `rotateZ(-${ringRotation * 1.5}deg)`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: "30%",
                  height: "30%",
                  borderRadius: "50%",
                  backgroundColor: "rgba(72,196,212,0.1)",
                  boxShadow: "0 0 80px rgba(72,196,212,0.4)",
                  transform: `scale(${1 + Math.sin(frame / 10) * 0.1})`,
                }}
              />
            </div>

            {/* THE TOPIC HOLOGRAM */}
            {topicBoot > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "100%",
                  textAlign: "center",
                  transform: `translate(-50%, -50%) scale(${interpolate(topicBoot, [0, 1], [0, 1])}) translateY(${Math.sin(frame / 20) * 10}px)`,
                  zIndex: 20,
                }}
              >
                <div
                  style={{
                    fontFamily: '"Poppins", sans-serif',
                    fontSize: "120px",
                    fontWeight: 900,
                    color: "#00FFFF",
                    textShadow:
                      "0 20px 50px rgba(0,0,0,0.8), 0 0 40px rgba(0,255,255,0.6)",
                    letterSpacing: "15px",
                  }}
                >
                  CLOSURES
                </div>
                <div
                  style={{
                    fontFamily: '"Consolas", monospace',
                    fontSize: "30px",
                    color: "#A9B7C6",
                    marginTop: "10px",
                    opacity: interpolate(topicBoot, [0, 1], [0, 0.7]),
                  }}
                >
                  [ ADVANCED PYTHON CONCEPT ]
                </div>
              </div>
            )}
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* Header automatically shifts exactly when the dark room boots */}
      <Header theme={isDarkMode ? "dark" : "light"} />
    </AbsoluteFill>
  );
};
