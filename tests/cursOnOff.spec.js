import { translateAmos } from "./helpers/translate";

test("curs_on", () => {
  const amosBasicCode = `
    Curs On
  `;

  const [lexErrs, parseErrs, translatedJS] = translateAmos(amosBasicCode);

  expect(lexErrs.errors).toEqual([]);
  expect(parseErrs.errors).toEqual([]);

  const normalizedJS = translatedJS.replace(/\s+/g, " ").trim();

  expect(normalizedJS).toContain(
    `document.getElementById('amos-screen').style.cursor = 'auto';`,
  );
});

test("curs_off", () => {
  const amosBasicCode = `
    Curs Off
    `;

  const [lexErrs, parseErrs, translatedJS] = translateAmos(amosBasicCode);

  expect(lexErrs.errors).toEqual([]);
  expect(parseErrs.errors).toEqual([]);

  const normalizedJS = translatedJS.replace(/\s+/g, " ").trim();

  expect(normalizedJS).toContain(
    `document.getElementById('amos-screen').style.cursor = 'none';`,
  );
});
