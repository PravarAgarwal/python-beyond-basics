import React from "react";

export const SpeechBubble: React.FC<{
  type: "interviewer" | "candidate";
  titleText: string;
  referenceSentence: string;
}> = ({ type, titleText, referenceSentence }) => {
  const isInterviewer = type === "interviewer";

  // Now uses the golden color for both the Interviewer and the Candidate
  const tagColor = "#D5A65B";

  return (
    <div
      style={{
        position: "absolute",
        top: "250px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "96%",
        display: "flex",
        flexDirection: "column",
        zIndex: 20,
        fontFamily: '"Roboto", sans-serif',
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500;700&display=swap');`}</style>

      <div style={{ position: "relative", width: "100%" }}>
        <div
          style={{
            position: "absolute",
            top: "-35px",
            left: "40px",
            backgroundColor: tagColor,
            color: "#000000",
            padding: "15px 35px",
            borderRadius: "25px",
            fontWeight: 700,
            fontSize: "32px",
            zIndex: 2,
          }}
        >
          {titleText}
        </div>

        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "6px solid #8B98A5",
            borderRadius: "80px",
            padding: "80px 40px 65px 40px",
            textAlign: "center",
            fontSize: "64px",
            fontWeight: 700,
            color: "#000000",
            position: "relative",
            zIndex: 1,
            lineHeight: 1.2,
          }}
        >
          {referenceSentence}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "-35px",
            right: isInterviewer ? "180px" : "auto",
            left: !isInterviewer ? "180px" : "auto",
            width: "70px",
            height: "70px",
            backgroundColor: "#FFFFFF",
            borderBottom: "6px solid #8B98A5",
            borderRight: isInterviewer ? "6px solid #8B98A5" : "none",
            borderLeft: !isInterviewer ? "6px solid #8B98A5" : "none",
            transform: isInterviewer ? "rotate(45deg)" : "rotate(-45deg)",
            zIndex: 2,
          }}
        />
      </div>
    </div>
  );
};
