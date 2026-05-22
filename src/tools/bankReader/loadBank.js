export async function parseBankFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file was selected"));
      return;
    }
    const reader = new FileReader();

    reader.onload = function (e) {
      const arrayBuffer = e.target.result; // The result is now an ArrayBuffer
      const buffer = new Uint8Array(arrayBuffer); // Convert to Uint8Array for easier byte manipulation
      let offset = 6; // Adjust the starting offset as per the file format
      const numberExpected = (buffer[4] << 8) | buffer[5]; // Check this is correct

      let objectsArray = [];

      for (let i = 0; i < numberExpected; i++) {
        const width = (buffer[offset] << 8) | buffer[offset + 1];
        const height = (buffer[offset + 2] << 8) | buffer[offset + 3];
        const depth = (buffer[offset + 4] << 8) | buffer[offset + 5];
        const hotspotX = (buffer[offset + 6] << 8) | buffer[offset + 7];
        const hotspotY = (buffer[offset + 8] << 8) | buffer[offset + 9];

        const planarGraphicData = [];
        const dataSize = width * 2 * height * depth; // Ensure this calculation is correct

        for (let j = 0; j < dataSize; j++) {
          planarGraphicData.push(buffer[offset + 10 + j]);
        }

        const objectBuilder = {
          width,
          height,
          depth,
          hotspotX,
          hotspotY,
          planarGraphicData,
        };

        objectsArray.push(objectBuilder);
        offset += 10 + dataSize;
      }

      // Initialize colorPalette to hold 32 colors (64 bytes in total)
      let colorPalette = [];

      // Loop through each pair of bytes in the color palette section (32 colors x 2 bytes)
      for (let k = offset; k < offset + 64; k += 2) {
        const byte1 = buffer[k];
        const byte2 = buffer[k + 1];

        const color1 = (byte1 << 8) | byte2;

        // Extract the red, green, and blue components (4 bits each)
        const red = (color1 >> 8) & 0xf;
        const green = (color1 >> 4) & 0xf;
        const blue = color1 & 0xf;

        // Convert 4-bit values (0-15) to 8-bit values (0-255) by multiplying by 17
        const red8 = (red * 17).toString(16).padStart(2, "0");
        const green8 = (green * 17).toString(16).padStart(2, "0");
        const blue8 = (blue * 17).toString(16).padStart(2, "0");

        // Format as HTML color code #RRGGBB
        const color = "#" + red8 + green8 + blue8;
        colorPalette.push(color.toUpperCase());
      }
      
      resolve({ sprites: objectsArray, palette: colorPalette });
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file); // Use readAsArrayBuffer for binary data
  });
}
