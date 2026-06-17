import { translateAmos } from "./helpers/translate";

test("for_loop_simple", () => {
  const amosBasicCode = `
    For I=0 To 10
    Next I
  `;

  const [lexErrs, parseErrs, translatedJS] = translateAmos(amosBasicCode);
  expect(lexErrs.errors).toEqual([]);
  expect(parseErrs.errors).toEqual([]);

  const normalizedJS = translatedJS.replace(/\s+/g, " ").trim();

  const testTarget = `for (I = 0; I <= 10; I++) {}`;
  expect(normalizedJS).toContain(testTarget);
});

test("for_loop_with_code", () => {
  const amosBasicCode = `
  For I=0 To 10
      If Key State($10+I)
          P_DRAWKEYS[I]
          While Key State($10+I)
             Play 37+I,1
          Wend 
          P_DRAWKEYS[-1]
       End If 
    Next I
    `;

  const [lexErrs, parseErrs, translatedJS] = translateAmos(amosBasicCode);
  expect(lexErrs.errors).toEqual([]);
  expect(parseErrs.errors).toEqual([]);

  const normalizedJS = translatedJS.replace(/\s+/g, " ").trim();

  expect(normalizedJS).toContain("for (I = 0; I <= 10; I++) {");
  expect(normalizedJS).toContain(
    "if (currentPressedKey === keyMapping[16+I]) {",
  );
  expect(normalizedJS).toContain("P_DRAWKEYS(I);");
  expect(normalizedJS).toContain("soundPlayer(37+I, 1 * 1000);");
  expect(normalizedJS).toContain("P_DRAWKEYS(-1);");
});
