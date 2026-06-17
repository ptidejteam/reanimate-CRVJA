import { translateAmos } from "./helpers/translate";

function translate(code) {
  const [lexErrs, parseErrs, normalizedJS] = translateAmos(code);
  expect(lexErrs.errors).toEqual([]);
  expect(parseErrs.errors).toEqual([]);
  return normalizedJS.replace(/\s+/g, " ").trim();
}

test("load_banks without bank id", () => {
  const amosBasicCode = `
    Load "assets/icons.abk"
  `;

  const normalizedJS = translate(amosBasicCode);

  expect(normalizedJS).toContain("loadBank('\"assets/icons.abk\"', 1);");
});

test("load_banks with bank id", () => {
  const amosBasicCode = `Load "assets/icons.abk", 2`;

  const normalizedJS = translate(amosBasicCode);

  expect(normalizedJS).toContain("loadBank('\"assets/icons.abk\"', 2);");
});

