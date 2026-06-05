import { translateAmos } from "./helpers/translate";

test("for_loop_filled", () => {
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

  const translatedJsCode = translateAmos(amosBasicCode);
  const normalizedTranslatedJsCode = translatedJsCode.replace(/\s+/g, ' ').trim();

  expect(normalizedTranslatedJsCode).toContain("let I = 0; for (I = 0; I <= 10; I++) {");
  expect(normalizedTranslatedJsCode).toContain("if (currentPressedKey === keyMapping[16+I]) {");
  expect(normalizedTranslatedJsCode).toContain("P_DRAWKEYS(I);");
  expect(normalizedTranslatedJsCode).toContain("soundPlayer(37+I, 1*1000);");
  expect(normalizedTranslatedJsCode).toContain("P_DRAWKEYS(-1);");
});
