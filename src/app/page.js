"use client";
import React, { useEffect, useRef, useState } from "react";
import { Sketch } from "@uiw/react-color";
import AMOSDecoder from "@/src/utils/amosDecoder";
import AnalogClock from "@/src/app/components/ui/analogClock";
import {
  WorkbenchIcon,
  WorkbenchShell,
  WorkbenchWindow,
} from "@/src/app/components/ui/workbench";
import ReactMarkdown from "react-markdown";
import { styleButton } from "@/src/app/constants/styles";
import { useAMOSParser } from "@/src/app/hooks/useAmosParser";
import CodeEditorWithErrors from "@/src/app/components/editor/CodeEditorWithErrors";
import ExampleTabs from "@/src/app/components/editor/ExampleTabs";
import { downloadASCFile } from "@/src/utils/fileHandler";
import { parseBankFile } from "@/src/utils/parseAmosBank";
import { generateAmosBankFile } from "@/src/utils/generateAmosBank";
import { renderSpritePixels } from "@/src/utils/spriteRenderer";
import { useBankCreator } from "@/src/app/hooks/useBankCreator";
import BankEditor from "@/src/app/components/bank/BankEditor";
import AmosRunner from "@/src/app/components/runner/AmosRunner";
import BankSlotManager from "@/src/app/components/bank/BankSlotManager";

function App() {
  const [showCode, setShowCode] = useState(false);
  const [numBanks, setNumBanks] = useState(6);
  const [bankFiles, setBankFiles] = useState([]);
  const [option, setOption] = useState("file");
  const [AmosCode, setAmosCode] = useState("");
  const fileInputRef = useRef();
  const [createBank, setCreateBank] = useState(false);
  const [bankFileNames, setBankFileNames] = useState(
    Array(numBanks).fill(null),
  );
  const [decodedText, setDecodedText] = useState("");
  const { bankCreator, setBankCreator, clearBank } = useBankCreator();
  const { jsCode, parseErrors, forceParse } = useAMOSParser(AmosCode);
  useEffect(() => {
    setAmosCode(decodedText);
  }, [decodedText]);
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const amosBasicCode = event.target.result;
      setAmosCode(amosBasicCode);
      forceParse(amosBasicCode);
    };

    reader.readAsText(file);
  };
  const handleFileChange = (index, file) => {
    console.log(file);
    const newBankFiles = [...bankFiles];
    newBankFiles[index] = file;
    setBankFiles(newBankFiles);
  };
  const [runNonce, setRunNonce] = useState(0);
  const onRunClick = () => {
    // If you re-parse AMOS here, keep it; otherwise just bump the nonce
    setRunNonce((n) => n + 1);
  };
  const [showRender, setShowRender] = useState(false);
  const [showSpriteEditor, setShowSpriteEditor] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [showClock, setShowClock] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialContent, setTutorialContent] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(null);

  useEffect(() => {
    if (showTutorial && !tutorialContent) {
      fetch("/api/tutorial")
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
          id="crvja"
          label="CRVJA"
          icon="/icons/beer.png"
          onOpen={() => setShowCode(true)}
          selected={selectedIcon === "crvja"}
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
        <WorkbenchWindow title="CRVJA" onClose={() => setShowCode(false)}>
          <div>
            <div
              style={{
                display: "flex",
                marginTop: "0px", // This is the margin above the load/save/run buttons
                padding: "0px", // This is the padding around "inside" the Workbench "window"
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    height: "fit-content", // This is the area around the buttons at the top
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        marginLeft: "-2px",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",

                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          style={styleButton}
                          onMouseDown={(e) => {
                            e.target.style.transform = "translate(4px, 4px)";
                            e.target.style.boxShadow = "0 0 0 #004444";
                          }}
                          onMouseUp={(e) => {
                            e.target.style.transform = "translate(0, 0)";
                            e.target.style.boxShadow = "4px 4px 0 #004444";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "translate(0, 0)";
                            e.target.style.boxShadow = "4px 4px 0 #004444";
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = "translate(2px, 2px)";
                            e.target.style.boxShadow = "2px 2px 0 #004444";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = "translate(0, 0)";
                            e.target.style.boxShadow = "4px 4px 0 #004444";
                          }}
                        >
                          {" "}
                          Load .ASC File{" "}
                        </button>

                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          style={{
                            display: "none",
                          }}
                          accept=".asc, .txt, .amo"
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignContent: "center",
                        }}
                      >
                        <AMOSDecoder
                          onDecoded={(text) => setDecodedText(text)}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <button
                        onClick={() => {
                          const filename = "my_amos_code.asc"; // or generate dynamic name
                          downloadASCFile(filename, AmosCode);
                        }}
                        style={styleButton}
                        onMouseDown={(e) => {
                          e.target.style.transform = "translate(4px, 4px)";
                          e.target.style.boxShadow = "0 0 0 #004444";
                        }}
                        onMouseUp={(e) => {
                          e.target.style.transform = "translate(0, 0)";
                          e.target.style.boxShadow = "4px 4px 0 #004444";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "translate(0, 0)";
                          e.target.style.boxShadow = "4px 4px 0 #004444";
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "translate(2px, 2px)";
                          e.target.style.boxShadow = "2px 2px 0 #004444";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = "translate(0, 0)";
                          e.target.style.boxShadow = "4px 4px 0 #004444";
                        }}
                      >
                        {" "}
                        Save .ASC File{" "}
                      </button>

                      <button
                        onClick={async () => {
                          try {
                            await forceParse(AmosCode); // updates jsCode
                            onRunClick(); // bumps runNonce -> useEffect runs -> iframe rebuilt
                          } catch (err) {
                            console.error("❌ Failed to run code:", err);
                          }
                        }}
                        style={styleButton}
                        onMouseDown={(e) => {
                          e.target.style.transform = "translate(4px, 4px)";
                          e.target.style.boxShadow = "0 0 0 #004444";
                        }}
                        onMouseUp={(e) => {
                          e.target.style.transform = "translate(0, 0)";
                          e.target.style.boxShadow = "4px 4px 0 #004444";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "translate(0, 0)";
                          e.target.style.boxShadow = "4px 4px 0 #004444";
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "translate(2px, 2px)";
                          e.target.style.boxShadow = "2px 2px 0 #004444";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = "translate(0, 0)";
                          e.target.style.boxShadow = "4px 4px 0 #004444";
                        }}
                      >
                        {" "}
                        Run Program{" "}
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      width: "100%",
                      marginTop: "0px", // This is the margin above the "Examples" text and buttons
                    }}
                  >
                    <ExampleTabs
                      tabs={[
                        [
                          {
                            label: "Pac-Man",
                            onClick: async () => {
                              const resBank1 = await fetch(
                                "/examples/Example1_Pac-Man/Example1_Pac-Man.abk",
                              );
                              const blob = await resBank1.blob();
                              const file = new File(
                                [blob],
                                "Example1_Pac-Man.abk",
                              );
                              handleFileChange(0, file);

                              const text = await (
                                await fetch(
                                  "/examples/Example1_Pac-Man/Example1_Pac-Man.asc",
                                )
                              ).text();
                              setAmosCode(text);
                              forceParse(text);
                            },
                          },
                          {
                            label: "Piano",
                            onClick: async () => {
                              const text = await (
                                await fetch(
                                  "/examples/Example2_Piano/Example2_Piano.asc",
                                )
                              ).text();
                              setAmosCode(text);
                              forceParse(text);
                            },
                          },
                        ],
                        [
                          {
                            label: "Rotating Triangle",
                            onClick: async () => {
                              const text = await (
                                await fetch(
                                  "/examples/Example3_Rotating_Triangle/Example3_Rotating_Triangle.asc",
                                )
                              ).text();
                              setAmosCode(text);
                              forceParse(text);
                            },
                          },
                          {
                            label: "Colourful Text",
                            onClick: async () => {
                              const text = await (
                                await fetch(
                                  "/examples/Example4_Colourful_Text/Example4_Colourful_Text.asc",
                                )
                              ).text();
                              setAmosCode(text);
                              forceParse(text);
                            },
                          },
                        ],
                      ]}
                    />
                  </div>
                </div>
                <div
                  style={{
                    width: "100%", // This is the area containing the Code Editor and Program Screen
                    display: "flex",
                    flexDirection: "row",
                    height: "fit-content",
                    border: "1px solid black",
                    justifyContent: "space-between",
                    padding: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "100%", // This is the area around the Code Editor
                      display: "flex",
                      flexDirection: "column",
                      minHeight: "80vh", // Need this to show an empty code editor
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <label htmlFor="amos-code"> Code Editor </label>
                    </div>
                    <CodeEditorWithErrors
                      value={AmosCode}
                      onChange={setAmosCode}
                      errors={parseErrors}
                      style={{
                        width: "44vw", // This is the actual coding area
                        height: "100%",
                        margin: "0px",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      width: "100%", // This is the area around the Program Screen
                      display: "flex",
                      flexDirection: "column",
                      maxHeight: "fit-content",
                      alignItems: "center",
                    }}
                  >
                    <label htmlFor="amos-code"> Program Screen </label>
                    <AmosRunner
                      jsCode={jsCode}
                      runNonce={runNonce}
                      bankFiles={bankFiles}
                    />
                  </div>
                </div>
                &nbsp;
                <BankSlotManager
                  numBanks={numBanks}
                  bankFiles={bankFiles}
                  onFileChange={handleFileChange}
                />
              </div>
            </div>
          </div>
          &nbsp;
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
              {tutorialContent}{" "}
            </ReactMarkdown>{" "}
          </div>{" "}
        </WorkbenchWindow>
      )}
    </WorkbenchShell>
  );
}

export default App;
