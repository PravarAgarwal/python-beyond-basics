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
  random,
} from "remotion";
import { Header } from "../components/Header";

const HolographicCore: React.FC<{
  scale: number;
  blastActive: number;
  color?: string;
}> = ({ scale, blastActive, color = "#00FFFF" }) => {
  const frame = useCurrentFrame();
  const rotation = frame * 2.5;

  return (
    <div
      style={{
        width: "100px",
        height: "100px",
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
          width: "40px",
          height: "40px",
          backgroundColor: color,
          transform: `rotate(45deg) scale(${1 + blastActive * 0.4})`,
          boxShadow: `0 0 ${30 + blastActive * 50}px ${color}, 0 0 80px ${color}`,
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

const BlueprintHUD: React.FC<{ inSpring: number; outSpring: number }> = ({
  inSpring,
  outSpring,
}) => {
  const frame = useCurrentFrame();
  const scramblingNumber = Math.floor(random(Math.floor(frame / 3)) * 99);
  const displayNum =
    scramblingNumber < 10
      ? `0${scramblingNumber}`
      : scramblingNumber.toString();

  return (
    <div
      style={{
        position: "absolute",
        top: "45%",
        left: "50%",
        transform: `translate(-50%, -50%) scale(${interpolate(inSpring, [0, 1], [0.8, 1])}) translateY(${interpolate(inSpring, [0, 1], [50, 0])}px) scale(${interpolate(outSpring, [0, 1], [1, 1.5])})`,
        opacity: Math.min(inSpring, 1 - outSpring),
        width: "600px",
        height: "140px",
        backgroundColor: "rgba(30, 35, 46, 0.4)",
        backdropFilter: "blur(10px)",
        border: "2px dashed rgba(72,196,212,0.5)",
        borderRadius: "20px",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
        fontFamily: '"Consolas", monospace',
        color: "#FFFFFF",
        fontSize: "50px",
        fontWeight: 700,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <span style={{ color: "#A9B7C6", fontSize: "30px" }}>Input(</span>
        <span
          style={{
            color: "#FFFFFF",
            textShadow: "0 0 15px rgba(255,255,255,0.8)",
            width: "60px",
            textAlign: "center",
          }}
        >
          {displayNum}
        </span>
        <span style={{ color: "#A9B7C6", fontSize: "30px" }}>)</span>
      </div>
      <div
        style={{
          color: "#D5A65B",
          fontSize: "60px",
          textShadow: "0 0 20px rgba(213,166,91,0.8)",
        }}
      >
        ×
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <span style={{ color: "#A9B7C6", fontSize: "30px" }}>[</span>
        <span
          style={{
            color: "#00FFFF",
            textShadow: "0 0 20px rgba(0,255,255,0.8)",
          }}
        >
          FACTOR
        </span>
        <span style={{ color: "#A9B7C6", fontSize: "30px" }}>]</span>
      </div>
    </div>
  );
};

export const CodeSetupScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const SYNC = {
    parentBoot: 0.0,
    factorInject: 4.48,
    blueprintBoot: 6.0,
    leftDataBlast: 9.52,
    leftNodeSpawn: 9.52 + 0.2,
    rightDataBlast: 9.52 + 0.6 + 0.03,
    rightNodeSpawn: 9.52 + 0.8 + 0.03,
    codeBoxBoot: 13.68,
    line1: 14.0,
    line2: 14.5,
    line3: 15.0,
    line4: 15.5,
    highlight: 16.84,
  };

  const cameraScale = interpolate(frame, [0, 700], [1, 1.12]);

  const parentNode = spring({
    frame: frame - Math.round(SYNC.parentBoot * fps),
    fps,
    config: { damping: 25, stiffness: 60, mass: 1.5 },
  });
  const factorCoreDrop = spring({
    frame: frame - Math.round(SYNC.factorInject * fps),
    fps,
    config: { damping: 20, stiffness: 70, mass: 1.2 },
  });

  const hudIn = spring({
    frame: frame - Math.round(SYNC.blueprintBoot * fps),
    fps,
    config: { damping: 15, stiffness: 100 },
  });
  const hudOut = spring({
    frame: frame - Math.round(SYNC.leftDataBlast * fps),
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  const leftBlast = spring({
    frame: frame - Math.round(SYNC.leftDataBlast * fps),
    fps,
    config: { damping: 20, stiffness: 120 },
  });
  const rightBlast = spring({
    frame: frame - Math.round(SYNC.rightDataBlast * fps),
    fps,
    config: { damping: 20, stiffness: 120 },
  });
  const leftChild = spring({
    frame: frame - Math.round(SYNC.leftNodeSpawn * fps),
    fps,
    config: { damping: 15, stiffness: 120, mass: 1.2 },
  });
  const rightChild = spring({
    frame: frame - Math.round(SYNC.rightNodeSpawn * fps),
    fps,
    config: { damping: 15, stiffness: 120, mass: 1.2 },
  });

  const clearGraph = spring({
    frame: frame - Math.round(SYNC.codeBoxBoot * fps),
    fps,
    config: { damping: 30, stiffness: 50, mass: 2 },
  });
  const graphScale = interpolate(clearGraph, [0, 1], [1, 5]);
  const graphOpacity = interpolate(clearGraph, [0, 0.7, 1], [1, 0, 0]);

  const bootWidth = spring({
    frame: frame - Math.round(SYNC.codeBoxBoot * fps),
    fps,
    config: { damping: 25, stiffness: 80, mass: 1.5 },
  });
  const bootHeight = spring({
    frame: frame - Math.round(SYNC.codeBoxBoot * fps) - 8,
    fps,
    config: { damping: 25, stiffness: 60, mass: 1.5 },
  });

  const typeL1 = spring({
    frame: frame - Math.round(SYNC.line1 * fps),
    fps,
    config: { damping: 20, stiffness: 50 },
  });
  const typeL2 = spring({
    frame: frame - Math.round(SYNC.line2 * fps),
    fps,
    config: { damping: 20, stiffness: 50 },
  });
  const typeL3 = spring({
    frame: frame - Math.round(SYNC.line3 * fps),
    fps,
    config: { damping: 20, stiffness: 50 },
  });
  const typeL4 = spring({
    frame: frame - Math.round(SYNC.line4 * fps),
    fps,
    config: { damping: 20, stiffness: 50 },
  });

  const blink = Math.floor(frame / 10) % 2 === 0 ? 1 : 0;
  const climaxTrigger = spring({
    frame: frame - Math.round(SYNC.highlight * fps),
    fps,
    config: { damping: 30, stiffness: 80, mass: 1.5 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0F19" }}>
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
          }}
        />

        {/* 🚀 FIX: The Grid now physically powers up outward exactly when the Core drops in */}
        <div
          style={{
            position: "absolute",
            bottom: "-20%",
            left: "-50%",
            width: "200%",
            height: "80%",
            perspective: "600px",
            opacity:
              interpolate(factorCoreDrop, [0, 1], [0, 0.4]) - graphOpacity * 0,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              transform: "rotateX(75deg)",
              backgroundImage: `linear-gradient(rgba(0, 255, 255, 0.5) 2px, transparent 2px), linear-gradient(90deg, rgba(0, 255, 255, 0.5) 2px, transparent 2px)`,
              backgroundSize: "100px 100px",
              backgroundPosition: `0px ${frame * 3}px`,
              clipPath: `circle(${interpolate(factorCoreDrop, [0, 1], [0, 100])}% at 50% 50%)`,
            }}
          />
        </div>

        <AbsoluteFill
          style={{
            opacity: graphOpacity,
            transform: `scale(${graphScale})`,
            transformOrigin: "center 40%",
            zIndex: 10,
          }}
        >
          <svg
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          >
            <path
              d="M 540 380 Q 250 380, 250 850"
              fill="none"
              stroke="rgba(72,196,212,0.2)"
              strokeWidth="6"
            />
            <path
              d="M 540 380 Q 830 380, 830 850"
              fill="none"
              stroke="rgba(213,166,91,0.2)"
              strokeWidth="6"
            />

            {leftBlast > 0 && leftBlast < 1 && (
              <path
                d="M 540 380 Q 250 380, 250 850"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray="60 1000"
                strokeDashoffset={interpolate(leftBlast, [0, 1], [1000, -60])}
                style={{ filter: "drop-shadow(0px 0px 15px #FFFFFF)" }}
              />
            )}
            {rightBlast > 0 && rightBlast < 1 && (
              <path
                d="M 540 380 Q 830 380, 830 850"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray="60 1000"
                strokeDashoffset={interpolate(rightBlast, [0, 1], [1000, -60])}
                style={{ filter: "drop-shadow(0px 0px 15px #FFFFFF)" }}
              />
            )}
          </svg>

          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "50%",
              transform: `translate(-50%, calc(-50% + ${Math.sin(frame / 25) * 15}px)) scale(${interpolate(parentNode, [0, 1], [0, 1])})`,
              width: "280px",
              height: "280px",
              borderRadius: "50%",
              backgroundColor: "rgba(30, 35, 46, 0.6)",
              backdropFilter: "blur(20px)",
              border: "4px solid rgba(72, 196, 212, 0.4)",
              boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <HolographicCore
              scale={interpolate(factorCoreDrop, [0, 1], [0, 1])}
              blastActive={Math.max(
                leftBlast > 0 && leftBlast < 1
                  ? Math.sin(leftBlast * Math.PI)
                  : 0,
                rightBlast > 0 && rightBlast < 1
                  ? Math.sin(rightBlast * Math.PI)
                  : 0,
              )}
              color="#00FFFF"
            />
          </div>

          <BlueprintHUD inSpring={hudIn} outSpring={hudOut} />

          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "23%",
              transform: `translate(-50%, calc(-50% + ${Math.cos(frame / 20) * 12}px)) scale(${interpolate(leftChild, [0, 1], [0, 1])})`,
              width: "260px",
              height: "260px",
              borderRadius: "40px",
              backgroundColor: "rgba(30, 35, 46, 0.8)",
              backdropFilter: "blur(20px)",
              border: "4px solid #48C4D4",
              boxShadow: `0 25px 50px rgba(0,0,0,0.5), 0 0 ${interpolate(leftChild, [0, 1], [0, 40])}px rgba(72,196,212,0.3)`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div style={{ position: "absolute", opacity: 0.3 }}>
              <HolographicCore scale={1.2} blastActive={0} color="#00FFFF" />
            </div>
            <div
              style={{
                fontFamily: '"Poppins", sans-serif',
                fontSize: "90px",
                fontWeight: 900,
                color: "#00FFFF",
                textShadow: "0 0 20px rgba(0,255,255,0.5)",
                zIndex: 5,
              }}
            >
              x2
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "77%",
              transform: `translate(-50%, calc(-50% + ${Math.sin((frame + 40) / 22) * 14}px)) scale(${interpolate(rightChild, [0, 1], [0, 1])})`,
              width: "260px",
              height: "260px",
              borderRadius: "40px",
              backgroundColor: "rgba(30, 35, 46, 0.8)",
              backdropFilter: "blur(20px)",
              border: "4px solid #D5A65B",
              boxShadow: `0 25px 50px rgba(0,0,0,0.5), 0 0 ${interpolate(rightChild, [0, 1], [0, 40])}px rgba(213,166,91,0.3)`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div style={{ position: "absolute", opacity: 0.3 }}>
              <HolographicCore scale={1.2} blastActive={0} color="#00FFFF" />
            </div>
            <div
              style={{
                fontFamily: '"Poppins", sans-serif',
                fontSize: "90px",
                fontWeight: 900,
                color: "#D5A65B",
                textShadow: "0 0 20px rgba(213,166,91,0.5)",
                zIndex: 5,
              }}
            >
              x3
            </div>
          </div>
        </AbsoluteFill>

        <div
          style={{
            position: "absolute",
            top: "22%",
            left: "50%",
            width: "85%",
            zIndex: 20,
            opacity: bootWidth,
            transform: `translateX(-50%) scaleX(${interpolate(bootWidth, [0, 1], [0.01, 1])}) scaleY(${interpolate(bootHeight, [0, 1], [0.01, 1])})`,
            backgroundColor: "#1E232E",
            borderRadius: "25px",
            padding: "60px 40px",
            fontFamily: '"Consolas", "Courier New", monospace',
            fontSize: "46px",
            lineHeight: 1.8,
            color: "#A9B7C6",
            border: `4px solid ${interpolateColors(climaxTrigger, [0, 1], ["#2D3748", "#00FFFF"])}`,
            boxShadow: `0 30px 60px rgba(0,0,0,0.8), 0 0 ${interpolate(climaxTrigger, [0, 1], [0, 50])}px rgba(0,255,255,0.3)`,
          }}
        >
          <div
            style={{
              clipPath: `inset(0 ${interpolate(typeL1, [0, 1], [100, 0])}% 0 0)`,
            }}
          >
            <span style={{ color: "#CC7832" }}>def</span>{" "}
            <span style={{ color: "#FFC66D" }}>make_multiplier</span>(
            <span
              style={{
                color: climaxTrigger > 0.1 ? "#00FFFF" : "#A9B7C6",
                textShadow:
                  climaxTrigger > 0.1 ? "0 0 25px rgba(0,255,255,1)" : "none",
              }}
            >
              factor
            </span>
            ):
            {typeL1 < 1 && (
              <span style={{ color: "#FFFFFF", opacity: blink }}>█</span>
            )}
          </div>
          <div
            style={{
              paddingLeft: "60px",
              clipPath: `inset(0 ${interpolate(typeL2, [0, 1], [100, 0])}% 0 0)`,
            }}
          >
            <span style={{ color: "#CC7832" }}>def</span>{" "}
            <span style={{ color: "#FFC66D" }}>multiply</span>(number):
            {typeL1 === 1 && typeL2 < 1 && (
              <span style={{ color: "#FFFFFF", opacity: blink }}>█</span>
            )}
          </div>
          <div
            style={{
              paddingLeft: "120px",
              clipPath: `inset(0 ${interpolate(typeL3, [0, 1], [100, 0])}% 0 0)`,
            }}
          >
            <span style={{ color: "#CC7832" }}>return</span> number *{" "}
            <span
              style={{
                color: climaxTrigger > 0.1 ? "#00FFFF" : "#A9B7C6",
                textShadow:
                  climaxTrigger > 0.1 ? "0 0 25px rgba(0,255,255,1)" : "none",
              }}
            >
              factor
            </span>
            {typeL2 === 1 && typeL3 < 1 && (
              <span style={{ color: "#FFFFFF", opacity: blink }}>█</span>
            )}
          </div>
          <br />
          <div
            style={{
              paddingLeft: "60px",
              clipPath: `inset(0 ${interpolate(typeL4, [0, 1], [100, 0])}% 0 0)`,
            }}
          >
            <span style={{ color: "#CC7832" }}>return</span> multiply
            {typeL3 === 1 && typeL4 < 1 && (
              <span style={{ color: "#FFFFFF", opacity: blink }}>█</span>
            )}
            {typeL4 === 1 && (
              <span style={{ color: "#FFFFFF", opacity: blink }}>█</span>
            )}
          </div>

          <svg
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 10,
              opacity: climaxTrigger,
            }}
          >
            <path
              d="M 630 100 C 760 100, 760 260, 630 260"
              fill="none"
              stroke="rgba(0,255,255,0.2)"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M 630 100 C 760 100, 760 260, 630 260"
              fill="none"
              stroke="#00FFFF"
              strokeWidth="8"
              strokeDasharray="300"
              strokeDashoffset={interpolate(climaxTrigger, [0, 1], [300, 0])}
              strokeLinecap="round"
              style={{ filter: "drop-shadow(0px 0px 12px #00FFFF)" }}
            />
          </svg>
        </div>
      </AbsoluteFill>
      <Header theme="dark" />
    </AbsoluteFill>
  );
};
