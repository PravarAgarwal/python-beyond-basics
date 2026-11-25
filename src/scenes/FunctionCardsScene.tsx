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
              marginRight: "20px",
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
          transform: `rotate(45deg)`,
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

const DataDrive: React.FC<{
  bootSpring: number;
  injectSpring: number;
  name: string;
  factor: string;
  color: string;
  top: string;
}> = ({ bootSpring, injectSpring, name, factor, color, top }) => {
  const dynamicBorder = interpolateColors(
    injectSpring,
    [0, 1],
    ["rgba(169, 183, 198, 0.2)", color],
  );
  const dynamicShadow = interpolate(injectSpring, [0, 1], [0, 40]);
  const shockwaveScale = interpolate(injectSpring, [0, 0.5, 1], [0, 1.5, 2]);
  const shockwaveOpacity = interpolate(injectSpring, [0, 0.5, 1], [1, 0.5, 0]);

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: "50%",
        width: "750px",
        transform: "translateX(-50%)",
        zIndex: 10,
      }}
    >
      <div
        style={{
          transform: `perspective(1000px) rotateX(${interpolate(bootSpring, [0, 1], [60, 0])}deg) translateY(${interpolate(bootSpring, [0, 1], [100, 0])}px) scale(${interpolate(bootSpring, [0, 1], [0.8, 1])})`,
          opacity: bootSpring,
          backgroundColor: "rgba(30, 35, 46, 0.6)",
          backdropFilter: "blur(20px)",
          borderRadius: "30px",
          border: `3px solid ${dynamicBorder}`,
          boxShadow: `0 30px 60px rgba(0,0,0,0.6), 0 0 ${dynamicShadow}px ${color}`,
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: '"Poppins", sans-serif',
              fontSize: "55px",
              fontWeight: 800,
              color: "#FFFFFF",
            }}
          >
            {name}{" "}
            <span
              style={{ color: "#A9B7C6", fontSize: "40px", fontWeight: 500 }}
            >
              = make_multiplier({factor})
            </span>
          </div>
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              border: `3px dashed ${dynamicBorder}`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            {injectSpring > 0 && injectSpring < 1 && (
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  backgroundColor: color,
                  transform: `scale(${shockwaveScale})`,
                  opacity: shockwaveOpacity,
                }}
              />
            )}
            <div
              style={{
                transform: `scale(${interpolate(injectSpring, [0, 1], [5, 1])})`,
                opacity: injectSpring,
              }}
            >
              <HolographicCore scale={1} color={color} />
            </div>
          </div>
        </div>
        <div
          style={{
            fontFamily: '"Consolas", monospace',
            fontSize: "38px",
            color: "#A9B7C6",
            backgroundColor: "rgba(0,0,0,0.3)",
            padding: "30px",
            borderRadius: "15px",
            opacity: interpolate(injectSpring, [0, 1], [0.3, 1]),
            transform: `translateY(${interpolate(injectSpring, [0, 1], [20, 0])}px)`,
          }}
        >
          <div>
            <span style={{ color: "#CC7832" }}>def</span>{" "}
            <span style={{ color: "#FFC66D" }}>multiply</span>(number):
          </div>
          <div style={{ paddingLeft: "40px" }}>
            <span style={{ color: "#CC7832" }}>return</span> number *{" "}
            <span
              style={{
                color: injectSpring > 0.5 ? color : "#A9B7C6",
                textShadow: injectSpring > 0.5 ? `0 0 15px ${color}` : "none",
                fontWeight: "bold",
              }}
            >
              {factor}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FunctionCardsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneStart = transcript[10].timestamp[0] ?? 0;

  const SYNC = {
    introP1: 0,
    introP2: 1.0,
    introP3: 1.8,
    introOut: (transcript[11].timestamp[0] ?? 0) - sceneStart - 0.8,
    card1Boot: (transcript[11].timestamp[0] ?? 0) - sceneStart - 0.6,
    core1Inject: (transcript[11].timestamp[0] ?? 0) - sceneStart,
    card2Boot: (transcript[12].timestamp[0] ?? 0) - sceneStart - 0.6,
    core2Inject: (transcript[12].timestamp[0] ?? 0) - sceneStart,
    outro1In: (transcript[13].timestamp[0] ?? 0) - sceneStart,
    outro2In: (transcript[14].timestamp[0] ?? 0) - sceneStart,
  };

  const cameraScale = interpolate(frame, [0, 700], [1, 1.05]);
  const cinematicConfig = { damping: 25, stiffness: 70, mass: 1.5 };
  const impactConfig = { damping: 15, stiffness: 120, mass: 1.2 };

  const introP3Spring = spring({
    frame: frame - Math.round(SYNC.introP3 * fps),
    fps,
    config: { damping: 14, stiffness: 220, mass: 1.5 },
  });
  const introOutSpring = spring({
    frame: frame - Math.round(SYNC.introOut * fps),
    fps,
    config: { damping: 25, stiffness: 90, mass: 1.5 },
  });

  const card1Boot = spring({
    frame: frame - Math.round(SYNC.card1Boot * fps),
    fps,
    config: cinematicConfig,
  });
  const card2Boot = spring({
    frame: frame - Math.round(SYNC.card2Boot * fps),
    fps,
    config: cinematicConfig,
  });
  const inject1 = spring({
    frame: frame - Math.round(SYNC.core1Inject * fps),
    fps,
    config: impactConfig,
  });
  const inject2 = spring({
    frame: frame - Math.round(SYNC.core2Inject * fps),
    fps,
    config: impactConfig,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0F19" }}>
      {/* 🚀 THE MASSIVE FULL-SCREEN TAKEOVER */}
      <AbsoluteFill
        style={{
          zIndex: 100,
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
          opacity: 1 - introOutSpring,
          transform: `scale(${interpolate(introOutSpring, [0, 1], [1, 5])}) translateY(${interpolate(introOutSpring, [0, 1], [0, 100])}px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(11,15,25,0.85)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 1,
            textAlign: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              fontFamily: '"Poppins", sans-serif',
              fontSize: "90px",
              fontWeight: 900,
              lineHeight: 1.1,
            }}
          >
            {frame < Math.round((SYNC.introOut + 1) * fps) && (
              <GlitchText
                text="NOW LET'S CREATE"
                startFrame={Math.round(SYNC.introP1 * fps)}
                delay={2}
                color="#FFFFFF"
              />
            )}
          </div>

          <div
            style={{
              fontFamily: '"Poppins", sans-serif',
              fontSize: "130px",
              fontWeight: 900,
              lineHeight: 1.1,
              marginTop: "-10px",
            }}
          >
            {frame < Math.round((SYNC.introOut + 1) * fps) && (
              <GlitchText
                text="TWO FUNCTIONS"
                startFrame={Math.round(SYNC.introP2 * fps)}
                delay={2}
                color="#48C4D4"
              />
            )}
          </div>

          <div
            style={{
              transform: `scale(${interpolate(introP3Spring, [0, 1], [3, 0.9])}) rotate(${interpolate(introP3Spring, [0, 1], [15, -4])}deg)`,
              opacity: introP3Spring,
              backgroundColor: "#1E232E",
              border: "6px solid #FFC66D",
              borderRadius: "30px",
              padding: "30px 40px",
              marginTop: "60px",
              boxShadow:
                "0 40px 80px rgba(0,0,0,0.8), 0 0 60px rgba(255,198,109,0.4)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: "90%",
            }}
          >
            <span
              style={{
                color: "#CC7832",
                fontSize: "65px",
                fontFamily: '"Consolas", monospace',
                fontWeight: "bold",
              }}
            >
              def
            </span>
            <div>
              <span
                style={{
                  color: "#FFC66D",
                  fontSize: "65px",
                  fontFamily: '"Consolas", monospace',
                  fontWeight: "bold",
                }}
              >
                make_multiplier
              </span>
              <span
                style={{
                  color: "#A9B7C6",
                  fontSize: "65px",
                  fontFamily: '"Consolas", monospace',
                  fontWeight: "bold",
                }}
              >
                (...)
              </span>
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* ========================================== */}
      {/* 🚀 THE DATA DRIVES */}
      {/* ========================================== */}
      <AbsoluteFill
        style={{
          transform: `scale(${cameraScale})`,
          transformOrigin: "top center",
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
            top: "15%",
            left: "-10%",
            fontSize: "220px",
            fontWeight: 900,
            fontFamily: '"Poppins", sans-serif',
            color: "rgba(255,255,255,0.02)",
            whiteSpace: "nowrap",
            transform: `translateX(${interpolate(frame, [0, 700], [-300, -1000])}px)`,
          }}
        >
          PRACTICAL APPLICATION INSTANCES
        </div>

        {/* ✨ FIX: Pushed cards down to give the header breathing room while closing the bottom gap */}
        <DataDrive
          bootSpring={card1Boot}
          injectSpring={inject1}
          name="double"
          factor="2"
          color="#00FFFF"
          top="15%"
        />
        <DataDrive
          bootSpring={card2Boot}
          injectSpring={inject2}
          name="triple"
          factor="3"
          color="#D5A65B"
          top="42%"
        />

        {/* ✨ FIX: Lowered text slightly to perfectly balance the gap */}
        <div
          style={{
            position: "absolute",
            top: "67%",
            left: "5%",
            width: "90%",
            zIndex: 10,
            textAlign: "center",
            fontFamily: '"Poppins", sans-serif',
            fontSize: "55px",
            fontWeight: 800,
            lineHeight: 1.2,
          }}
        >
          {frame > Math.round(SYNC.outro1In * fps) && (
            <GlitchText
              text="And just like that, we have two different functions,"
              startFrame={Math.round(SYNC.outro1In * fps)}
              delay={1}
              color="#FFFFFF"
            />
          )}
          <br />
          <br />
          {frame > Math.round(SYNC.outro2In * fps) && (
            <GlitchText
              text="each remembering its own multiplier."
              startFrame={Math.round(SYNC.outro2In * fps)}
              delay={1}
              color="#48C4D4"
            />
          )}
        </div>
      </AbsoluteFill>

      <Header theme="dark" />
    </AbsoluteFill>
  );
};
