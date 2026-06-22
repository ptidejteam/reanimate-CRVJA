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
import ReAnimate26Tabs from "@/src/app/components/editor/ReAnimate26Tabs";
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
  const clearBanks = () => {
	while(bankFiles.length > 0) {
		bankFiles.pop();
	}
	setBankFiles(bankFiles);
  };
  const handleBankChange = (index, file) => {
	bankFiles[index] = file;
	setBankFiles(bankFiles);
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
                      marginBottom: "10px",
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
					  padding: "10px"
                    }}
                  >
                    <ExampleTabs
                      tabs={[
                        [
                          {
                            label: "Pac-Man",
                            onClick: async () => {
                              clearBanks();
                              const resBank = await fetch(
                                "/examples/Example1_Pac-Man/Example1_Pac-Man.abk",
                              );
                              const blob = await resBank.blob();
                              const file = new File(
                                [blob],
                                "Example1_Pac-Man.abk",
                              );
                              handleBankChange(0, file);
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
					&nbsp;
                    <ReAnimate26Tabs
                      tabs={[
                        [
                          {
                            label: "Escape From Reanimate 🥇",
                            onClick: async () => {
                              clearBanks();
                              let resBank = await fetch(
                                "/reanimate26/EscapeFromReanimate_Kotowicz_Maher_Abdalla_Ullmann/AmosBank_Escape1.abk",
                              );
                              let blob = await resBank.blob();
                              let file = new File(
                                [blob],
                                "AmosBank_Escape1.abk",
                              );
                              handleBankChange(0, file);
                              resBank = await fetch(
                                "/reanimate26/EscapeFromReanimate_Kotowicz_Maher_Abdalla_Ullmann/AmosBank_Escape2.abk",
                              );
                              blob = await resBank.blob();
                              file = new File(
                                [blob],
                                "AmosBank_Escape2.abk",
                              );
                              handleBankChange(1, file);
                              const text = await (
                                await fetch(
                                  "/reanimate26/EscapeFromReanimate_Kotowicz_Maher_Abdalla_Ullmann/Game.asc",
                                )
                              ).text();
                              setAmosCode(text);
                              forceParse(text);
                            },
                          },
                          {
                            label: "Park Bedlam 🥇",
                            onClick: async () => {
                              clearBanks();
                              let resBank = await fetch(
                                "/reanimate26/ParkBedlam_Shifan_Franiczek_Ejaz_Scistri/AleksBank.abk",
                              );
                              let blob = await resBank.blob();
                              let file = new File(
                                [blob],
                                "AleksBank.abk",
                              );
                              handleBankChange(0, file);
                              resBank = await fetch(
                                "/reanimate26/ParkBedlam_Shifan_Franiczek_Ejaz_Scistri/Cat.abk",
                              );
                              blob = await resBank.blob();
                              file = new File(
                                [blob],
                                "Cat.abk",
                              );
                              handleBankChange(1, file);
                              resBank = await fetch(
                                "/reanimate26/ParkBedlam_Shifan_Franiczek_Ejaz_Scistri/DuckSquirrel.abk",
                              );
                              blob = await resBank.blob();
                              file = new File(
                                [blob],
                                "DuckSquirrel.abk",
                              );
                              handleBankChange(2, file);
                              resBank = await fetch(
                                "/reanimate26/ParkBedlam_Shifan_Franiczek_Ejaz_Scistri/Pigeon.abk",
                              );
                              blob = await resBank.blob();
                              file = new File(
                                [blob],
                                "Pigeon.abk",
                              );
                              handleBankChange(3, file);
                              resBank = await fetch(
                                "/reanimate26/ParkBedlam_Shifan_Franiczek_Ejaz_Scistri/Raccoon.abk",
                              );
                              blob = await resBank.blob();
                              file = new File(
                                [blob],
                                "Raccoon.abk",
                              );
                              handleBankChange(4, file);
                              const text = await (
                                await fetch(
                                  "/reanimate26/ParkBedlam_Shifan_Franiczek_Ejaz_Scistri/park_bedlam_v20.asc",
                                )
                              ).text();
                              setAmosCode(text);
                              forceParse(text);
                            },
                          },
						],
						[
                          {
                            label: "Welcome to the Backrooms 🥈",
                            onClick: async () => {
                              clearBanks();
                              const resBank = await fetch(
                                "/reanimate26/Welcome_to_the_Backrooms_Politowski_Bigot_Serra_Lopez/Sprite.abk",
                              );
                              const blob = await resBank.blob();
                              const file = new File(
                                [blob],
                                "Sprite.abk",
                              );
                              handleBankChange(0, file);
                              const text = await (
                                await fetch(
                                  "/reanimate26/Welcome_to_the_Backrooms_Politowski_Bigot_Serra_Lopez/Welcome_to_the_Backrooms.asc",
                                )
                              ).text();
                              setAmosCode(text);
                              forceParse(text);
                            },
                          },
                        ],
						[
                          {
                            label: "Galaxy Patrol 🥉",
                            onClick: async () => {
                              clearBanks();
                              const resBank = await fetch(
                                "/reanimate26/GalaxyPatrol_Tondorf_Chua_Zongo_Bijani/gjs.abk",
                              );
                              const blob = await resBank.blob();
                              const file = new File(
                                [blob],
                                "gjs.abk",
                              );
                              handleBankChange(0, file);
                              const text = await (
                                await fetch(
                                  "/reanimate26/GalaxyPatrol_Tondorf_Chua_Zongo_Bijani/GalaxyPatrol_TCZB.asc",
                                )
                              ).text();
                              setAmosCode(text);
                              forceParse(text);
                            },
                          },
                          {
                            label: "World of Iris 🥉",
                            onClick: async () => {
                              clearBanks();
                              const resBank = await fetch(
                                "/reanimate26/WorldOfIris_Mioto_Petrillo_Yefi_Guéhéneuc/WoI.abk",
                              );
                              const blob = await resBank.blob();
                              const file = new File(
                                [blob],
                                "WoI.abk",
                              );
                              handleBankChange(0, file);
                              const text = await (
                                await fetch(
                                  "/reanimate26/WorldOfIris_Mioto_Petrillo_Yefi_Guéhéneuc/WoI.asc",
                                )
                              ).text();
                              setAmosCode(text);
                              forceParse(text);
                            },
                          },
                        ],
                      ]}
                    />
					&nbsp;
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
                  onFileChange={handleBankChange}
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
