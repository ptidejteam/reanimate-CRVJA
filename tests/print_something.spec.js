import { translateAmos } from "./helpers/translate";

test("print_something", () => {
  const amosBasicCode = `Print 500/Timer;" FPS"`;

  const translatedJsCode = translateAmos(amosBasicCode);
  const normalizedTranslatedJsCode = translatedJsCode.replace(/\s+/g, ' ').trim();

  // Print item 0 (expression 500/Timer)
  expect(normalizedTranslatedJsCode).toContain("const finder_printDiv0 = document.getElementById('printDiv0' + '500/Timer');");
  expect(normalizedTranslatedJsCode).toContain("const printDiv0 = document.createElement('div');");
  expect(normalizedTranslatedJsCode).toContain("printDiv0.innerText = 500/Timer;");
  expect(normalizedTranslatedJsCode).toContain("printDiv0.style.color = Ink;");
  expect(normalizedTranslatedJsCode).toContain("printDiv0.style.zIndex = \"999\";");
  expect(normalizedTranslatedJsCode).toContain("printDiv0.id = 'printDiv0' + '500/Timer';");

  // Print item 1 (string literal " FPS")
  expect(normalizedTranslatedJsCode).toContain("const finder_printDiv1 = document.getElementById('printDiv1' + '\" FPS\"');");
  expect(normalizedTranslatedJsCode).toContain("const printDiv1 = document.createElement('div');");
  expect(normalizedTranslatedJsCode).toContain("printDiv1.innerText = \" FPS\";");
  expect(normalizedTranslatedJsCode).toContain("printDiv1.style.color = Ink;");
  expect(normalizedTranslatedJsCode).toContain("printDiv1.style.zIndex = \"999\";");
  expect(normalizedTranslatedJsCode).toContain("printDiv1.id = 'printDiv1' + '\" FPS\"';");
});
