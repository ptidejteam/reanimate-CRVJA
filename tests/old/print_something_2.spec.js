import { translateAmos } from "./helpers/translate";

test("print_something_2", () => {
  const amosBasicCode = `
  Open Out 1, TempFile
  Print #1,"Hello, World!"
  Close 1
  Open In 2, TempFile
  Input #2, A$
  Close 2
  Print A$`;

  const translatedJsCode = translateAmos(amosBasicCode);
  const normalizedTranslatedJsCode = translatedJsCode.replace(/\s+/g, ' ').trim();

  // Assert file channel operations
  expect(normalizedTranslatedJsCode).toContain("openFile('TempFile', 1, 'w');");
  expect(normalizedTranslatedJsCode).toContain("writeToChannel(#1, \"Hello, World!\");");
  expect(normalizedTranslatedJsCode).toContain("closeChannel(1);");
  expect(normalizedTranslatedJsCode).toContain("openFile('TempFile', 2, 'r');");
  expect(normalizedTranslatedJsCode).toContain("closeChannel(2);");

  // File input assertions
  expect(normalizedTranslatedJsCode).toContain("let A$ = '';");
  expect(normalizedTranslatedJsCode).toContain("readFromChannel(#2, (data) => { A$ = data; });");

  // Print assertion
  expect(normalizedTranslatedJsCode).toContain("printDiv0.innerText = A$;");
  expect(normalizedTranslatedJsCode).toContain("printDiv0.style.color = Ink;");
  expect(normalizedTranslatedJsCode).toContain("printDiv0.id = 'printDiv0' + 'A$';");
});
