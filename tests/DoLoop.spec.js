import { translateAmos } from "./helpers/translate";

test("do_loop", () => {
  const amosBasicCode = `
  Do 

  Loop 
    `;

  const [lexErrs, parseErrs, translatedJS] = translateAmos(amosBasicCode);
  expect(lexErrs.errors).toEqual([]);
  expect(parseErrs.errors).toEqual([]);

  const normalizedJS = translatedJS.replace(/\s+/g, " ").trim();

  // Assert against current translator output containing loop guard and setInterval
  expect(normalizedJS).toContain("while(true) {await new Promise(r => setTimeout(r, 16));}");
});
