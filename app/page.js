"use client";
import React, { useEffect, useRef, useState } from "react";
import { Sketch } from "@uiw/react-color";
import AMOSDecoder from "@/src/tools/AmosDecoder";
import AnalogClock from "@/src/tools/UI/analogClock";
import { WorkbenchIcon, WorkbenchShell, WorkbenchWindow } from "@/src/tools/UI/workbench";
import ReactMarkdown from 'react-markdown';
import { styleButton } from "@/app/constants/styles";
import { useAMOSParser } from "@/app/hooks/useAMOSParser";
import CodeEditorWithErrors from "@/app/components/Editor/CodeEditorWithErrors";
import ExampleTabs from "@/app/components/Editor/ExampleTabs";
import { downloadASCFile } from "@/src/tools/fileUtils";
import { parseBankFile } from "@/src/tools/bankReader/loadBank";
import { generateAmosBankFile } from "@/src/tools/bankWriter/generateAmosBankFile";
import { renderSpritePixels } from "@/src/tools/spriteRenderer";
import { useBankCreator } from "@/app/hooks/useBankCreator";

function App() {
  const [showCode, setShowCode] = useState(false);


  const [numBanks, setNumBanks] = useState(6);
  const [bankFiles, setBankFiles] = useState([]);
  const [option, setOption] = useState("file");
  const [AmosCode, setAmosCode] = useState("");
  const fileInputRef = useRef();
  const [createBank, setCreateBank] = useState(false);
  const [bankFileNames, setBankFileNames] = useState(
    Array(numBanks).fill(null)
  );
  const [decodedText, setDecodedText] = useState("");
  const { bankCreator, setBankCreator, clearBank } = useBankCreator();
  const { jsCode, parseErrors, forceParse } = useAMOSParser(AmosCode);

  useEffect(() => {
    setAmosCode(decodedText);
  }, [decodedText]);

  const bankFilesRef = React.useRef(bankFiles);
  useEffect(() => { bankFilesRef.current = bankFiles; }, [bankFiles]);


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
  useEffect(() => {
    if (!jsCode) return;

    const host = document.getElementById("game-container");
    if (!host) {
      console.error('AMOS runner: host "#game-container" not found.');
      return;
    }
    console.log("[parent] AMOS runner: host found, injecting iframe…");
    host.replaceChildren();

    const token = Math.random().toString(36).slice(2);

    const iframe = document.createElement("iframe");
    iframe.setAttribute("sandbox", "allow-scripts allow-same-origin");
    iframe.style.border = "0";
    iframe.style.display = "block";
    iframe.style.width = "640px"; // initial; iframe will resize itself
    iframe.style.height = "480px";
    host.style.display = "inline-block";

    // ---- PLAIN JS selector; find the bank file inputs in the PARENT ----
    const forwardBanks = async () => {
      // 1) existing: from real <input type="file">
      const inputs = Array.from(
        document.querySelectorAll(
          'input[type="file"][id^="bankStored"], input[type="file"][id^="Creator_bankStored"]'
        )
      );

      for (const input of inputs) {
        const file = input.files && input.files[0];
        if (!file) continue;
        const buffer = await file.arrayBuffer();
        const m = input.id.match(/(\d+)$/);
        const bankId = m ? m[1] : "";
        iframe.contentWindow?.postMessage(
          {
            type: "amos-bank",
            token,
            bankId,
            name: file.name,
            mime: file.type || "application/octet-stream",
            buffer,
          },
          "*",
          [buffer]
        );
      }

      // 2) NEW: also forward from React state (programmatically loaded files)
      const files = bankFilesRef.current || [];
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        if (!f) continue;
        const buffer = await f.arrayBuffer();
        iframe.contentWindow?.postMessage(
          {
            type: "amos-bank",
            token,
            bankId: String(i + 1),      // banks are 1-based in your IDs
            name: f.name,
            mime: f.type || "application/octet-stream",
            buffer,
          },
          "*",
          [buffer]
        );
      }
    };


    const onMessage = (e) => {
      const data = e.data || {};
      if (data.token !== token) return;

      if (data.type === "amos-size") {
        iframe.style.width = `${Math.max(1, Math.round(data.width))}px`;
        iframe.style.height = `${Math.max(1, Math.round(data.height))}px`;
      }

      if (data.type === "amos-ready") {
        Promise.resolve()
          .then(forwardBanks) // run on next tick to be safe
          .then(() => {
            console.log("[parent] banks forwarded, telling iframe we're done");
            iframe.contentWindow &&
              iframe.contentWindow.postMessage(
                { type: "amos-banks-done", token },
                "*"
              );
          });
      }
    };
    window.addEventListener("message", onMessage);

    const FONT_CSS = `
@font-face { font-family: 'Amiga4Ever';
  src: url('/fonts/amiga/amiga4ever.ttf') format('truetype'); font-display: swap; }
@font-face { font-family: 'Amiga4EverPro';
  src: url('/fonts/amiga/amiga4ever-pro.ttf') format('truetype'); font-display: swap; }
html, body, #game-container, #amos-screen, * { font-family: 'Amiga4Ever', sans-serif; }
`;

    iframe.srcdoc = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      ${FONT_CSS}
      html, body { margin:0; padding:0; height:100%; overflow:hidden; box-sizing:border-box; }
      *, *::before, *::after { box-sizing: inherit; }
      #game-container { position:relative; display:inline-block; }
      #amos-screen { box-sizing: content-box; }
      body { font: 14px/1.4 system-ui, sans-serif; }
    </style>
  </head>
  <body>
    <div id="game-container"></div>
    <script>
      const TOKEN = ${JSON.stringify(token)};
      const EXTRA = 30;

      // Tell parent we're ready to receive banks
      window.parent && window.parent.postMessage({ type: "amos-ready", token: TOKEN }, "*");

      // Pipe console to parent (optional)
      (function () {
        const send = (level, args) => {
          try { parent.postMessage({ type: "amos-console", level, args, token: TOKEN }, "*"); } catch {}
        };
        ["log","warn","error","info"].forEach(level => {
          const orig = console[level];
          console[level] = function () { send(level, Array.from(arguments)); orig && orig.apply(console, arguments); };
        });
        window.onerror = function (msg, src, line, col, err) {
          send("error", [msg, { src, line, col, stack: err && err.stack }]);
        };
      })();

      // --- BANK STORE + RESOLVER ---
      const BANKS_BY_ID   = new Map();   // "1" -> rec
      const BANKS_BY_NAME = new Map();   // exact lowercased name -> rec
      const BANKS_BY_NORM = new Map();   // normalized key -> rec

      const clean = (s) => String(s || "").trim().replace(/['"]/g, "");
      const norm  = (s) => {
        s = clean(s).toLowerCase();
        s = s.replace(/^amosbank[_-]?/, "");     // drop "AmosBank_" prefix
        s = s.replace(/\.(abk|bank)$/i, "");     // drop extension
        s = s.replace(/[\s._-]+/g, "");          // remove separators
        return s;
      };

      // IMPORTANT: define banksReady so we can await it later
      let resolveBanksReady;
      const banksReady = new Promise((res) => {
        resolveBanksReady = res;
        setTimeout(res, 500); // fallback if no banks are posted
      });

      window.__getBankFile = function (bankId, bankName) {
        const nameClean = clean(bankName);
        const nameKey   = nameClean.toLowerCase();
        const normKey   = norm(nameClean);

        let rec = null;
        if (bankId != null) rec = BANKS_BY_ID.get(String(bankId));
        if (!rec && nameKey) rec = BANKS_BY_NAME.get(nameKey);
        if (!rec && normKey) rec = BANKS_BY_NORM.get(normKey);

   
        if (!rec) return null;
        try {
          return new File([rec.buffer], rec.name || \`bank\${bankId||''}.abk\`, { type: rec.mime || "application/octet-stream" });
        } catch {
          const blob = new Blob([rec.buffer], { type: rec.mime || "application/octet-stream" });
          blob.name = rec.name || \`bank\${bankId||''}.abk\`;
          return blob; // FileReader works with Blob too
        }
      };

      // Receive banks from parent
      window.addEventListener("message", (e) => {
        const d = e.data || {};
        if (d.token !== TOKEN) return;

        if (d.type === "amos-bank") {
          const rec  = { name: d.name, mime: d.mime || "application/octet-stream", buffer: d.buffer };
          const nkey = norm(d.name);
          if (d.bankId) BANKS_BY_ID.set(String(d.bankId), rec);
          if (d.name)   BANKS_BY_NAME.set(clean(d.name).toLowerCase(), rec);
          if (nkey)     BANKS_BY_NORM.set(nkey, rec);
          console.log("[iframe] received bank", { bankId: d.bankId, name: d.name, norm: nkey, bytes: d.buffer && d.buffer.byteLength });
        }

        if (d.type === "amos-banks-done") {
          console.log("[iframe] banks done signal");
          if (typeof resolveBanksReady === "function") resolveBanksReady();
        }
      });

      // --- Size reporting (+30 px cushion) ---
      const postSize = () => {
        const screen = document.getElementById("amos-screen");
        if (!screen) return;
        const rect = screen.getBoundingClientRect();
        const w = Math.max(rect.width, screen.scrollWidth, screen.offsetWidth);
        const h = Math.max(rect.height, screen.scrollHeight, screen.offsetHeight);
        try {
          parent.postMessage({ type: "amos-size", token: TOKEN, width: Math.ceil(w) + EXTRA, height: Math.ceil(h) + EXTRA }, "*");
        } catch {}
      };
      const tryInitObservers = () => {
        const screen = document.getElementById("amos-screen");
        if (!screen) return false;
        postSize();
        const ro = new ResizeObserver(() => postSize());
        ro.observe(screen);
        const mo = new MutationObserver(() => postSize());
        mo.observe(screen, { childList: true, subtree: true, attributes: true, characterData: true });
        requestAnimationFrame(postSize);
        return true;
      };
      const moRoot = new MutationObserver(() => { if (tryInitObservers()) moRoot.disconnect(); });
      moRoot.observe(document, { childList: true, subtree: true });
      tryInitObservers();

      // Run generated code only after banks are in (or timeout)
      (async () => {
        try {
          await banksReady;
          ${jsCode}
        } catch (e) {
          console.error("Async error in dynamic JavaScript:", e);
        }
      })();
    <\/script>
  </body>
</html>`.trim();

    host.appendChild(iframe);

    // Re-forward banks if the user changes inputs later
    const changeHandler = () => forwardBanks();
    const bankInputs = Array.from(
      document.querySelectorAll(
        'input[type="file"][id^="bankStored"], input[type="file"][id^="Creator_bankStored"]'
      )
    );
    bankInputs.forEach((el) => el.addEventListener("change", changeHandler));

    return () => {
      window.removeEventListener("message", onMessage);
      bankInputs.forEach((el) =>
        el.removeEventListener("change", changeHandler)
      );
      try {
        iframe.remove();
      } catch { }
    };
  }, [jsCode, runNonce]);



  // Helper function to convert pixels array to planar format

  // Helper function to convert a hex color to 4-bit RGB values

  function BankEditor({ bankCreator, setBankCreator }) {


    const [palette, setPalette] = useState(
      bankCreator.palette || Array(32).fill("#000000")
    );
    const [sprites, setSprites] = useState(bankCreator.sprites || []);
    const [spriteSelected, setSpriteSelected] = useState(null);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [colorPickerPosition, setColorPickerPosition] = useState({
      top: 0,
      left: 0,
    });
    const [selectedColorIndex, setSelectedColorIndex] = useState(null);
    const [currentColorIndex, setCurrentColorIndex] = useState(0);
    const [spriteWidth, setSpriteWidth] = useState(0);
    const [spriteHeight, setSpriteHeight] = useState(0);

    useEffect(() => {
      const handleMouseUp = () => setIsMouseDown(false);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }, []);
    const handlePixelPaint = (index) => {
      if (spriteSelected !== null) {
        const selectedSprite = sprites[spriteSelected];
        const actualWidth = selectedSprite.width * 16;
        const bytesPerRow = Math.ceil(actualWidth / 8);

        const x = index % actualWidth;
        const y = Math.floor(index / actualWidth);

        for (let plane = 0; plane < selectedSprite.depth; plane++) {
          const bit = (currentColorIndex >> plane) & 1;
          const byteIndex =
            y * bytesPerRow +
            plane * (selectedSprite.height * bytesPerRow) +
            Math.floor(x / 8);
          const bitPos = 7 - (x % 8);

          if (bit) {
            selectedSprite.planarGraphicData[byteIndex] |= 1 << bitPos;
          } else {
            selectedSprite.planarGraphicData[byteIndex] &= ~(1 << bitPos);
          }
        }

        const updatedSprites = sprites.map((sprite, i) =>
          i === spriteSelected ? { ...selectedSprite } : sprite
        );
        setSprites(updatedSprites);
      }
    };

    const handleColorClick = (index, event) => {
      event.preventDefault();
      if (event.button === 2) {
        setSelectedColorIndex(index);
        setColorPickerPosition({ top: event.clientY, left: event.clientX });
        setShowColorPicker(true);
      } else if (event.button === 0) {
        console.log("Current color: ", index);
        setCurrentColorIndex(index);
      }
    };

    const handleColorChange = (color) => {
      const newPalette = [...palette];
      newPalette[selectedColorIndex] = color.hex;
      setPalette(newPalette);
    };

    const addNewSprite = () => {
      const newSprite = {
        width: 1,
        height: 16,
        depth: 4, // Default depth (4 color planes for 16 colors)
        hotspotX: 0,
        hotspotY: 0,
        planarGraphicData: [], // Initialize planarGraphicData with zeros for an 8x8 sprite
      };
      const updatedSprites = [...sprites, newSprite];
      setSprites(updatedSprites);
      setBankCreator({ ...bankCreator, sprites: updatedSprites });
    };

    const selectSprite = (index) => {
      setSpriteSelected(index);
    };

    const handlePixelClick = (index) => {
      if (spriteSelected !== null) {
        const selectedSprite = sprites[spriteSelected];
        const actualWidth = selectedSprite.width * 16; // Convert to actual pixel width
        const bytesPerRow = Math.ceil(actualWidth / 8);

        // Calculate x and y based on index
        const x = index % actualWidth;
        const y = Math.floor(index / actualWidth);

        // Update the planarGraphicData based on currentColorIndex
        for (let plane = 0; plane < selectedSprite.depth; plane++) {
          const bit = (currentColorIndex >> plane) & 1;
          const byteIndex =
            y * bytesPerRow +
            plane * (selectedSprite.height * bytesPerRow) +
            Math.floor(x / 8);
          const bitPos = 7 - (x % 8);

          if (bit) {
            selectedSprite.planarGraphicData[byteIndex] |= 1 << bitPos;
          } else {
            selectedSprite.planarGraphicData[byteIndex] &= ~(1 << bitPos);
          }
        }

        // Update the sprites array with the modified sprite
        const updatedSprites = sprites.map((sprite, i) =>
          i === spriteSelected ? { ...selectedSprite } : sprite
        );
        console.log(selectedSprite);
        setSprites(updatedSprites);
      }
    };

    const updateSpriteSize = (dimension, value) => {
      if (spriteSelected !== null) {
        const newSize = Number(value);
        const selectedSprite = sprites[spriteSelected];

        if (!isNaN(newSize) && newSize > 0) {
          const newSprite = {
            ...selectedSprite,
            [dimension]: newSize,
            planarGraphicData: Array(
              spriteHeight * spriteWidth * selectedSprite.depth * 2
            ).fill(0), // Reset planar data based on new size
          };

          if (dimension === "width") {
            newSprite.planarGraphicData = Array(
              newSize * spriteHeight * selectedSprite.depth * 2
            ).fill(0);
          } else {
            newSprite.planarGraphicData = Array(
              spriteWidth * newSize * selectedSprite.depth * 2
            ).fill(0);
          }

          console.log(newSprite);
          const updatedSprites = sprites.map((sprite, i) =>
            i === spriteSelected ? newSprite : sprite
          );
          setSprites(updatedSprites);
        }
      }
    };
    const duplicateSprite = () => {
      if (spriteSelected !== null) {
        const original = sprites[spriteSelected];

        // Deep copy of planarGraphicData
        const copiedPlanarData = [...original.planarGraphicData];

        const duplicatedSprite = {
          ...original,
          planarGraphicData: copiedPlanarData,
        };

        const updatedSprites = [...sprites, duplicatedSprite];
        setSprites(updatedSprites);
        setBankCreator({ ...bankCreator, sprites: updatedSprites });
      }
    };

    const handleSpriteClick = (index) => {
      setSpriteSelected(index);
      setSpriteHeight(sprites[index].height);
      setSpriteWidth(sprites[index].width);
    };

    // Save bank data to local storage
    const saveBankToLocalStorage = () => {
      const bankData = JSON.stringify(bankCreator);
      localStorage.setItem("bankCreator", bankData);
    };

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "20%",
          border: "1px solid red",

        }}
      >
        <div>
          <button
            onClick={() => {
              console.log(bankCreator);
              generateAmosBankFile(bankCreator);
            }}
          >
            GENERATE BANK FILE
          </button>
          <div>
            Load bank:
            <input
              id={`Creator_bankStored1`}
              type="file"
              onChange={async (e) => {
                setBankCreator({ ...bankCreator, sprites: [], palette: [] });
                if (e.target.files.length > 0) {
                  const file = e.target.files[0];
                  console.log("File selected for bank 1:", file.name);
                  try {
                    const result = await parseBankFile(file);
                    setBankCreator({ ...bankCreator, ...result });
                  } catch (err) {
                    console.error("Failed to load bank:", err);
                  }
                }
              }}
              multiple
            />
          </div>
          <button onClick={() => saveBankToLocalStorage()}>
            Save Bank to Local Storage
          </button>
          <h2>Palette</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(1, 1fr)",
              gap: "4px",
            }}
          >
            {palette.map((color, index) => (
              <div
                key={index}
                style={{
                  width: "30px",
                  height: "30px",
                  backgroundColor: color,
                  border: "1px solid black",
                  cursor: "pointer",
                }}
                onClick={(event) => handleColorClick(index, event)}
                onContextMenu={(event) => handleColorClick(index, event)}
              >
                {color}
              </div>
            ))}
          </div>
          {showColorPicker && (
            <div
              style={{
                position: "absolute",
                top: colorPickerPosition.top,
                left: colorPickerPosition.left,
                zIndex: 1000,
              }}
            >
              <button
                onClick={() => {
                  setBankCreator({ ...bankCreator, palette: palette });
                  setShowColorPicker(false);
                }}
              >
                Close
              </button>
              <Sketch
                color={palette[selectedColorIndex]}
                onChange={handleColorChange}
                onClose={() => setShowColorPicker(false)}
              />
            </div>
          )}
        </div>

        <div>
          <h2>Pixel Editor</h2>
          <div>
            <label>Width:</label>
            <input
              type="number"
              value={
                spriteSelected !== null ? sprites[spriteSelected].width : ""
              }
              onChange={(e) => updateSpriteSize("width", e.target.value)}
            />
          </div>
          <div>
            <label>Height:</label>
            <input
              type="number"
              value={
                spriteSelected !== null ? sprites[spriteSelected].height : ""
              }
              onChange={(e) => updateSpriteSize("height", e.target.value)}
            />
          </div>
          <div>
            <button
              onClick={() => {
                console.log(sprites[spriteSelected]);
                setBankCreator({ ...bankCreator, sprites: sprites });
              }}
            >
              Save
            </button>
            <button
              onClick={() => {
                console.log(sprites[spriteSelected]);
                const spritesCopy = [...sprites];
                spritesCopy.splice(spriteSelected, 1);
                setBankCreator({ ...bankCreator, sprites: spritesCopy });
              }}
            >
              Delete
            </button>
          </div>
          {spriteSelected !== null && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${sprites[spriteSelected].width * 16
                  }, 20px)`,
                gap: "1px",
              }}
            >
              {renderSpritePixels(
                sprites[spriteSelected].planarGraphicData,
                sprites[spriteSelected].width * 16,
                sprites[spriteSelected].height,
                sprites[spriteSelected].depth,
                palette
              ).map((color, index) => (
                <div
                  key={index}
                  style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: color,
                    border: "1px solid #ccc",
                    cursor: "pointer",
                  }}
                  onClick={() => handlePixelClick(index)}
                  onMouseDown={() => {
                    setIsMouseDown(true);
                    handlePixelPaint(index);
                  }}
                  onMouseEnter={() => {
                    if (isMouseDown) handlePixelPaint(index);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <h2>Sprites</h2>
          <button onClick={duplicateSprite}>Duplicate Sprite selected</button>

          <button onClick={addNewSprite}>Add New Sprite</button>
          <button
            onClick={clearBank}
            style={{
              marginTop: "10px",
              backgroundColor: "#FF6961",
              color: "#FFF",
            }}
          >
            Clear Bank
          </button>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "4px",
              marginTop: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "4px",
                marginTop: "10px",
              }}
            >
              {sprites.map((sprite, index) => {
                const width = sprite.width * 16; // Convert width in words to pixels
                const pixels = renderSpritePixels(
                  sprite.planarGraphicData,
                  width,
                  sprite.height,
                  sprite.depth,
                  palette
                );

                return (
                  <div
                    key={index}
                    onClick={() => {
                      handleSpriteClick(index);
                    }}
                    onContextMenu={(event) => {
                      event.preventDefault();
                      console.log(sprites[index]);
                      const spritesCopy = [...sprites];
                      spritesCopy.splice(index, 1);
                      setBankCreator({ ...bankCreator, sprites: spritesCopy });
                      selectSprite(index);
                    }}
                    style={{
                      width: "40px",
                      height: "40px",
                      border:
                        spriteSelected === index
                          ? "2px solid blue"
                          : "1px solid black",
                      cursor: "pointer",
                      display: "grid",
                      gridTemplateColumns: `repeat(${width}, 1fr)`,
                    }}
                  >
                    {pixels.map((color, pixelIndex) => (
                      <div
                        key={pixelIndex}
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor:
                            color === palette[0] ? "transparent" : color,
                        }}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }



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
        .then(res => res.text())
        .then(text => setTutorialContent(text))
        .catch(err => console.error("Failed to load tutorial", err));
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
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "60px",
          margin: "20px"
        }}>
        <WorkbenchIcon id="crvja" label="CRVJA" icon="/icons/beer.png" onOpen={() => setShowCode(true)} selected={selectedIcon === "crvja"}
          setSelectedIcon={setSelectedIcon} />
        <WorkbenchIcon id="sprites" label="Sprites" icon="/icons/sprite.png" onOpen={() => setShowSpriteEditor(true)} selected={selectedIcon === "sprites"}
          setSelectedIcon={setSelectedIcon} />

        <WorkbenchIcon id="clock" label="Clock" icon="/icons/clock.png" onOpen={() => setShowClock(true)} selected={selectedIcon === "clock"}
          setSelectedIcon={setSelectedIcon} />
        <WorkbenchIcon id="tutorial" label="Tutorial" icon="/icons/book.png" onOpen={() => setShowTutorial(true)} selected={selectedIcon === "tutorial"}
          setSelectedIcon={setSelectedIcon} />
      </div>

      {/* Windows */}
      {showCode && (
        <WorkbenchWindow title="CRVJA" onClose={() => setShowCode(false)}>
          <div>

            <div
              style={{
                display: "flex",
                marginTop: "30px",

                padding: "5px",
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
                    height: "20vh",

                  }}
                >
                  <div style={{ display: 'flex', flexDirection: "row", gap: "10px" }} >
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
                          Load .ASC File
                        </button>

                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          style={{ display: "none" }}
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
                        <AMOSDecoder onDecoded={(text) => setDecodedText(text)} />
                      </div>

                    </div>
                    <div style={{ display: 'flex', flexDirection: "column", gap: "10px" }} >
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
                        Run code
                      </button>
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
                        Save .ASC Code
                      </button>
                    </div>
                  </div>

                  <div style={{ width: "100%", marginTop: "10px" }}>
                    <ExampleTabs
                      tabs={[
                        [

                          {
                            label: "Pacman",
                            onClick: async () => {
                              const resBank1 = await fetch("/AmosFiles/AmosBank_pacman.abk");
                              const blob = await resBank1.blob();
                              const file = new File([blob], "AmosBank_pacman.abk");
                              handleFileChange(0, file);

                              const text = await (await fetch("/AmosFiles/Pacman.txt")).text();
                              setAmosCode(text);
                              parseAmosCode(text);
                            },
                          },
                          {
                            label: "Piano",
                            onClick: async () => {
                              const text = await (await fetch("/AmosFiles/Amos1_piano_improved.asc")).text();
                              setAmosCode(text);
                              parseAmosCode(text);
                            },
                          },

                        ],
                        [
                          {
                            label: "Rotating Triangle",
                            onClick: async () => {
                              const text = await (await fetch("/AmosFiles/Amos2_Rotating_Triangle.txt")).text();
                              setAmosCode(text);
                              parseAmosCode(text);
                            },
                          },
                          {
                            label: "Empty",
                            onClick: () => {
                              setAmosCode("");
                              parseAmosCode("");
                            },
                          },
                        ],
                      ]}
                    />
                  </div>

                </div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    height: "fit-content",
                    border: "1px solid black",
                    justifyContent: "space-between",

                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      maxHeight: "80vh",
                      minHeight: "500px"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignContent: "center",
                        alignItems: "center",
                        gap: "20px"
                      }}
                    >
                      {" "}
                      <label htmlFor="amos-code">Code Area</label>


                    </div>

                    <CodeEditorWithErrors
                      value={AmosCode}
                      onChange={setAmosCode}
                      errors={parseErrors}
                      style={{ width: "44vw", height: "100%", margin: "10px" }}
                    />
                  </div>
                  <div>

                  </div>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      maxHeight: "200vh",
                      alignItems: "center",
                      minHeight: "100vh"

                    }}
                  >
                    <label htmlFor="amos-code">Render code area</label>
                    <div id="game-container"></div>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    border: "1px solid black",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div>
                      {" "}
                      {bankFiles.map((file, index) => (
                        <li key={index}>
                          Bank {index + 1}:{" "}
                          {file ? file.name.split("_")[1] : <i>No file selected</i>}
                        </li>
                      ))}
                    </div>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ width: "100%" }}>
                      {Array.from({ length: numBanks }, (_, index) => (
                        <div style={{ marginBottom: "10px" }} key={index}>
                          <label>Bank {index + 1}: </label>
                          <input
                            id={`bankStored${index + 1}`}
                            type="file"
                            onChange={(e) => {
                              if (e.target.files.length > 0) {
                                const file = e.target.files[0];
                                console.log(
                                  `File selected for bank ${index + 1}:`,
                                  file.name
                                );
                                handleFileChange(index, file);
                              }
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>
        </WorkbenchWindow>
      )}


      {showSpriteEditor && (
        <WorkbenchWindow title="Sprite Editor" onClose={() => setShowSpriteEditor(false)}>
          <BankEditor
            bankCreator={bankCreator}
            setBankCreator={setBankCreator}
          />
        </WorkbenchWindow>
      )}


      {showClock && (
        <WorkbenchWindow title="Clock" onClose={() => setShowClock(false)}>
          <AnalogClock />
        </WorkbenchWindow>
      )}

      {showTutorial && (
        <WorkbenchWindow title="Tutorial" onClose={() => setShowTutorial(false)}>
          <div style={{ padding: '20px', background: '#fff', color: '#000', height: '100%', overflowY: 'auto', boxSizing: 'border-box', userSelect: 'text' }}>
            <ReactMarkdown
              components={{
                code({node, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '');
                  return match ? (
                    <div style={{ position: 'relative', marginTop: '10px', marginBottom: '10px' }}>
                      <button
                        onClick={() => navigator.clipboard.writeText(String(children).replace(/\n$/, ''))}
                        style={{
                          position: 'absolute',
                          top: '5px',
                          right: '5px',
                          padding: '6px 12px',
                          backgroundColor: '#00aaaa',
                          color: 'white',
                          border: '2px solid #006666',
                          boxShadow: '2px 2px 0 #004444',
                          cursor: 'pointer',
                          fontFamily: 'monospace',
                          fontSize: '12px',
                          zIndex: 10
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
                        Copy
                      </button>
                      <pre style={{
                        backgroundColor: '#222',
                        color: '#0f0',
                        padding: '16px',
                        paddingTop: '36px',
                        border: '4px solid #444',
                        overflowX: 'auto',
                        fontFamily: '"Amiga4Ever", monospace',
                        userSelect: 'text',
                        whiteSpace: 'pre-wrap'
                      }}>
                        <code className={className} {...props} style={{ userSelect: 'text' }}>
                          {children}
                        </code>
                      </pre>
                    </div>
                  ) : (
                    <code className={className} {...props} style={{ backgroundColor: '#eee', padding: '2px 4px', borderRadius: '4px', userSelect: 'text' }}>
                      {children}
                    </code>
                  )
                }
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
