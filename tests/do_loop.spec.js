import { translateAmos } from "./helpers/translate";

test("do_loop", () => {
  const amosBasicCode = `
  Do 

  Loop 
    `;

  const translatedJsCode = translateAmos(amosBasicCode);
  
  // Assert against current translator output containing loop guard and setInterval
  const normalizedTranslatedJsCode = translatedJsCode.replace(/\s+/g, ' ').trim();
  
  expect(normalizedTranslatedJsCode).toContain("let allowLoop = true;");
  expect(normalizedTranslatedJsCode).toContain("setInterval(() => {");
  expect(normalizedTranslatedJsCode).toContain("if (!allowLoop) return;");
  expect(normalizedTranslatedJsCode).toContain("currentTimer = Date.now();");
  expect(normalizedTranslatedJsCode).toContain("Timer++;");
  expect(normalizedTranslatedJsCode).toContain("Timer = 9;");
  expect(normalizedTranslatedJsCode).toContain("}, 16);");
});
