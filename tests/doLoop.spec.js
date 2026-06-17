import { translateAmos } from "./helpers/translate";

function translate(code) {
  const [lexErrs, parseErrs, normalizedJS] = translateAmos(code);
  expect(lexErrs.errors).toEqual([]);
  expect(parseErrs.errors).toEqual([]);
  return normalizedJS.replace(/\s+/g, " ").trim();
}

test("do_loop", () => {
  const amosBasicCode = `
  Do 

  Loop 
    `;

  const normalizedJS = translate(amosBasicCode);

  // Assert against current translator output containing loop guard and setInterval
  expect(normalizedJS).toContain("while(true) {await new Promise(r => setTimeout(r, 16));}");
});

