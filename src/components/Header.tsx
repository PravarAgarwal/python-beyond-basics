import React from "react";

export const Header: React.FC<{ theme?: "light" | "dark" }> = ({
  theme = "light",
}) => {
  const isDark = theme === "dark";

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 50,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "70px 40px",
        boxSizing: "border-box",
        fontFamily: '"Poppins", sans-serif',
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;800&display=swap');`}</style>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontWeight: 800,
            fontSize: "48px",
            letterSpacing: "1px",
            lineHeight: 1.1,
            color: isDark ? "#FFFFFF" : "#172B45", // White in dark mode
          }}
        >
          PYTHON BEYOND
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <div
            style={{
              fontWeight: 800,
              fontSize: "32px",
              letterSpacing: "1px",
              color: isDark ? "#48C4D4" : "#172B45", // Cyan in dark mode
            }}
          >
            THE BASICS
          </div>
          <div
            style={{
              height: "5px",
              width: "80px",
              backgroundColor: isDark ? "#D5A65B" : "#172B45", // Gold line in dark mode
            }}
          />
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#172B45",
          color: "white",
          padding: "12px 45px",
          borderRadius: "50px",
          fontSize: "44px",
          fontWeight: 700,
          border: "7px solid #6BA4B8",
        }}
      >
        02 / 05
      </div>
    </div>
  );
};
