import { translateAmos } from "../helpers/translate";

test("print_something_2", () => {
  const amosBasicCode = `
  Open Out 1, TempFile
  Print #1,"Hello, World!"
  Close 1
  Open In 2, TempFile
  Input #2, A$
  Close 2
  Print A$`;

  const [lexErrs, parseErrs, normalizedJS] = translateAmos(amosBasicCode);
  expect(lexErrs.errors).toEqual([]);
  expect(parseErrs.errors).toEqual([]);
  
  

  // Assert file channel operations
  expect(normalizedJS).toContain("openFile('TempFile', 1, 'w');");
  expect(normalizedJS).toContain("writeToChannel(#1, \"Hello, World!\");");
  expect(normalizedJS).toContain("closeChannel(1);");
  expect(normalizedJS).toContain("openFile('TempFile', 2, 'r');");
  expect(normalizedJS).toContain("closeChannel(2);");

  // File input assertions
  expect(normalizedJS).toContain("let A$ = '';");
  expect(normalizedJS).toContain("readFromChannel(#2, (data) => { A$ = data; });");

  // Print assertion
  expect(normalizedJS).toContain("printDiv0.innerText = A$;");
  expect(normalizedJS).toContain("printDiv0.style.color = Ink;");
  expect(normalizedJS).toContain("printDiv0.id = 'printDiv0' + 'A$';");
});
