import { translateAmos } from "./helpers/translate";

function translate(code) {
  const [lexErrs, parseErrs, normalizedJS] = translateAmos(code);
  expect(lexErrs.errors).toEqual([]);
  expect(parseErrs.errors).toEqual([]);
  return normalizedJS.replace(/\s+/g, " ").trim();
}

test("string assignments", () => {
  const amosBasicCode = `
A$ = "Hello, World!"
  `;

  const normalizedJS = translate(amosBasicCode);

  expect(normalizedJS).toContain('A$ = "Hello, World!";');

});

test("string assignments and text", () => {
  const amosBasicCode = `
A$ = "Hello, World!"
Text 10,10,A$
  `;

  const normalizedJS = translate(amosBasicCode);

  expect(normalizedJS).toContain('A$ = "Hello, World!";');
  expect(normalizedJS).toContain('textDiv1010.innerText = A$;');
});
