import { translateAmos } from "./helpers/translate";

test("cls translation", () => {
  const amosBasicCode = `
    Cls
    `;

  const [lexErrs, parseErrs, translatedJS] = translateAmos(amosBasicCode);

  expect(lexErrs.errors).toEqual([]);
  expect(parseErrs.errors).toEqual([]);

  const normalizedJS = translatedJS.replace(/\s+/g, " ").trim();

  // Check if the output contains the screen clearing commands
  expect(normalizedJS).toContain(
    "const amosScreen = document.getElementById('amos-screen');",
  );
  expect(normalizedJS).toContain("amosScreen.innerHTML = '';");
});

test("cls with color translation", () => {
  const amosBasicCode = `
    Cls 2
    `;
  
  const [lexErrs, parseErrs, translatedJS] = translateAmos(amosBasicCode);

  expect(lexErrs.errors).toEqual([]);
  expect(parseErrs.errors).toEqual([]);
  
  const normalizedJS = translatedJS.replace(/\s+/g, " ").trim();

  // Check if the output contains the screen clearing commands
  expect(normalizedJS).toContain(
    "const amosScreen = document.getElementById('amos-screen');",
  );
  expect(normalizedJS).toContain("amosScreen.innerHTML = '';");

  // Check if it sets the background color using the colorMapping dictionary
  expect(normalizedJS).toContain(
    'amosScreen.style.backgroundColor = colorMapping[2];',
  );
});

test("cls with block area translation", () => {
  const amosBasicCode = `
        Cls 2,10,20 To 100,200
    `;

  const [lexErrs, parseErrs, translatedJS] = translateAmos(amosBasicCode);

  expect(lexErrs.errors).toEqual([]);
  expect(parseErrs.errors).toEqual([]);
  
  const normalizedJS = translatedJS.replace(/\s+/g, " ").trim();

  expect(normalizedJS).toContain(
    'const clearColor = colorMapping[2];',
  );
  expect(normalizedJS).toContain("const clearX1 = 10;");
  expect(normalizedJS).toContain("const clearY1 = 20;");
  expect(normalizedJS).toContain("const clearX2 = 100;");
  expect(normalizedJS).toContain("const clearY2 = 200;");
  expect(normalizedJS).toContain(
    "fillDiv.style.backgroundColor = clearColor;",
  );
});
