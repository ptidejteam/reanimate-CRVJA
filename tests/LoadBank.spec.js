import { translateAmos } from "./helpers/translate";

test("load_banks without bank id", () => {
  const amosBasicCode = `
    Load "assets/icons.abk"
  `;

  const [lexErrs, parseErrs, translatedJS] = translateAmos(amosBasicCode);
  expect(lexErrs.errors).toEqual([]);
  expect(parseErrs.errors).toEqual([]);

  const normalizedJS = translatedJS.replace(/\s+/g, " ").trim();

  expect(normalizedJS).toContain("loadBank('\"assets/icons.abk\"', 1);");
});

test("load_banks with bank id", () => {
  const amosBasicCode = `Load "assets/icons.abk", 2`;

  const [lexErrs, parseErrs, translatedJS] = translateAmos(amosBasicCode);
  expect(lexErrs.errors).toEqual([]);
  expect(parseErrs.errors).toEqual([]);

  const normalizedJS = translatedJS.replace(/\s+/g, " ").trim();

  expect(normalizedJS).toContain("loadBank('\"assets/icons.abk\"', 2);");
});
