"use client";
import React, { useState, useEffect } from "react";
import { Sketch } from "@uiw/react-color";
import { generateAmosBankFile } from "@/src/tools/bankWriter/generateAmosBankFile";
import { parseBankFile } from "@/src/tools/bankReader/loadBank";
import { renderSpritePixels } from "@/src/tools/spriteRenderer";

export default function BankEditor({ bankCreator, setBankCreator }) {
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
      planarGraphicData: Array(128).fill(0), // Initialize planarGraphicData with zeros for 16x16 sprite
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
            value={spriteSelected !== null ? sprites[spriteSelected].width : ""}
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
              gridTemplateColumns: `repeat(${
                sprites[spriteSelected].width * 16
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
          onClick={() => {
            localStorage.removeItem("bankCreator");
            setBankCreator({ sprites: [], palette: Array(32).fill("#000000") });
            setSprites([]);
            setPalette(Array(32).fill("#000000"));
          }}
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
                    setSpriteSelected(null);
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
