import { translateAmos } from "./helpers/translate";

function translate(code) {
  const [lexErrs, parseErrs, normalizedJS] = translateAmos(code);
  expect(lexErrs.errors).toEqual([]);
  expect(parseErrs.errors).toEqual([]);
  return normalizedJS.replace(/\s+/g, " ").trim();
}

test("curs_on", () => {
  const amosBasicCode = `
    Curs On
  `;

  const normalizedJS = translate(amosBasicCode);

  expect(normalizedJS).toContain(
    `document.getElementById('amos-screen').style.cursor = 'auto';`,
  );
});

test("curs_off", () => {
  const amosBasicCode = `
    Curs Off
    `;

  const normalizedJS = translate(amosBasicCode);

  expect(normalizedJS).toContain(
    `document.getElementById('amos-screen').style.cursor = 'none';`,
  );
});

