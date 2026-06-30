"use client";
import React, { useEffect, useRef, useState } from "react";
import { Sketch } from "@uiw/react-color";
import AnalogClock from "@/src/app/components/ui/analogClock";
import {
  WorkbenchIcon,
  WorkbenchShell,
  WorkbenchWindow,
} from "@/src/app/components/ui/workbench";
import ReactMarkdown from "react-markdown";
import { useAMOSParser } from "@/src/app/hooks/useAmosParser";
import { parseBankFile } from "@/src/utils/parseAmosBank";
import { generateAmosBankFile } from "@/src/utils/generateAmosBank";
import { renderSpritePixels } from "@/src/utils/spriteRenderer";
import { useBankCreator } from "@/src/app/hooks/useBankCreator";
import BankEditor from "@/src/app/components/bank/BankEditor";
import { checkApiStatus } from "@/src/services/checkApiStatus";
import CinaIDE from "@/src/app/components/cina/CinaIDE";

function App() {
  const [showCode, setShowCode] = useState(false);
  const [option, setOption] = useState("file");
  const [createBank, setCreateBank] = useState(false);
  const { bankCreator, setBankCreator, clearBank } = useBankCreator();
  const [showRender, setShowRender] = useState(false);
  const [showSpriteEditor, setShowSpriteEditor] = useState(false);
  const [showExamples, setShowExamples] = useState(false); // TODO: To remove?
  const [showClock, setShowClock] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialContent, setTutorialContent] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(null);

  const handleApiTest = async () => {
    try {
      const data = await checkApiStatus();

      console.log("API Success: ", data);
    } catch (error) {
      console.error("Failed to fetch API: ", error);
    }
  };

  useEffect(() => {
    if (showTutorial && !tutorialContent) {
      fetch("/docs/tutorial.md")
        .then((res) => res.text())
        .then((text) => setTutorialContent(text))
        .catch((err) => console.error("Failed to load tutorial", err));
    }
  }, [showTutorial, tutorialContent]);

  return (
    <WorkbenchShell>
      {/* Icons Row */}
      <div
        onClick={() => setSelectedIcon(null)}
        style={{
          position: "absolute",

          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "60px",
          margin: "20px",
        }}
      >
        <WorkbenchIcon
          id="cina"
          label="CINA"
          icon="/icons/cina.png"
          onOpen={() => setShowCode(true)}
          selected={selectedIcon === "cina"}
          setSelectedIcon={setSelectedIcon}
        />{" "}
        <WorkbenchIcon
          id="sprites"
          label="Sprites"
          icon="/icons/sprite.png"
          onOpen={() => setShowSpriteEditor(true)}
          selected={selectedIcon === "sprites"}
          setSelectedIcon={setSelectedIcon}
        />
        <WorkbenchIcon
          id="clock"
          label="Clock"
          icon="/icons/clock.png"
          onOpen={() => setShowClock(true)}
          selected={selectedIcon === "clock"}
          setSelectedIcon={setSelectedIcon}
        />{" "}
        <WorkbenchIcon
          id="tutorial"
          label="Tutorial"
          icon="/icons/book.png"
          onOpen={() => setShowTutorial(true)}
          selected={selectedIcon === "tutorial"}
          setSelectedIcon={setSelectedIcon}
        />{" "}
        <WorkbenchIcon
          id="manual"
          label="Manual"
          icon="/icons/manual.png"
          onOpen={() => window.open("https://amospromanual.dev/", "_blank")}
          selected={selectedIcon === "manual"}
          setSelectedIcon={setSelectedIcon}
        />
      </div>
      {/* Windows */}
      {showCode && (
        <WorkbenchWindow title="CINA IDE" onClose={() => setShowCode(false)}>
          <CinaIDE />
        </WorkbenchWindow>
      )}

      {showSpriteEditor && (
        <WorkbenchWindow
          title="Sprite Editor"
          onClose={() => setShowSpriteEditor(false)}
        >
          <BankEditor
            bankCreator={bankCreator}
            setBankCreator={setBankCreator}
          />{" "}
        </WorkbenchWindow>
      )}

      {showClock && (
        <WorkbenchWindow title="Clock" onClose={() => setShowClock(false)}>
          <AnalogClock />
        </WorkbenchWindow>
      )}

      {showTutorial && (
        <WorkbenchWindow
          title="Tutorial"
          onClose={() => setShowTutorial(false)}
        >
          <div
            style={{
              padding: "20px",
              background: "#fff",
              color: "#000",
              height: "100%",
              overflowY: "auto",
              boxSizing: "border-box",
              userSelect: "text",
            }}
          >
            <ReactMarkdown
              components={{
                code({ node, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return match ? (
                    <div
                      style={{
                        position: "relative",
                        marginTop: "10px",
                        marginBottom: "10px",
                      }}
                    >
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(
                            String(children).replace(/\n$/, ""),
                          )
                        }
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                          padding: "6px 12px",
                          backgroundColor: "#00aaaa",
                          color: "white",
                          border: "2px solid #006666",
                          boxShadow: "2px 2px 0 #004444",
                          cursor: "pointer",
                          fontFamily: "monospace",
                          fontSize: "12px",
                          zIndex: 10,
                        }}
                        onMouseDown={(e) => {
                          e.target.style.transform = "translate(2px, 2px)";
                          e.target.style.boxShadow = "0 0 0 #004444";
                        }}
                        onMouseUp={(e) => {
                          e.target.style.transform = "translate(0, 0)";
                          e.target.style.boxShadow = "2px 2px 0 #004444";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "translate(0, 0)";
                          e.target.style.boxShadow = "2px 2px 0 #004444";
                        }}
                      >
                        Copy{" "}
                      </button>{" "}
                      <pre
                        style={{
                          backgroundColor: "#222",
                          color: "#0f0",
                          padding: "16px",
                          paddingTop: "36px",
                          border: "4px solid #444",
                          overflowX: "auto",
                          fontFamily: '"Amiga4Ever", monospace',
                          userSelect: "text",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        <code
                          className={className}
                          {...props}
                          style={{
                            userSelect: "text",
                          }}
                        >
                          {" "}
                          {children}{" "}
                        </code>{" "}
                      </pre>{" "}
                    </div>
                  ) : (
                    <code
                      className={className}
                      {...props}
                      style={{
                        backgroundColor: "#eee",
                        padding: "2px 4px",
                        borderRadius: "4px",
                        userSelect: "text",
                      }}
                    >
                      {" "}
                      {children}{" "}
                    </code>
                  );
                },
                img({ node, ...props }) {
                  return (
                    <img
                      {...props}
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        display: "block",
                        marginTop: "15px",
                        marginBottom: "15px",
                        borderRadius: "4px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        border: "1px solid #ccc",
                      }}
                    />
                  );
                },
              }}
            >
              {tutorialContent}
            </ReactMarkdown>
          </div>
        </WorkbenchWindow>
      )}
    </WorkbenchShell>
  );
}

export default App;
