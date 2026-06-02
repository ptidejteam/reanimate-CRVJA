import { translateAmos } from "./helpers/translate";

test("load_banks without bank id", () => {
  const amosBasicCode = `Load "assets/icons.abk"`;
  const translatedJsCode = translateAmos(amosBasicCode);
  const normalizedTranslatedJsCode = translatedJsCode.replace(/\s+/g, ' ').trim();
  
  expect(normalizedTranslatedJsCode).toContain("loadBank('\"assets/icons.abk\"', 1);");
});

test("load_banks with bank id", () => {
  const amosBasicCode = `Load "assets/icons.abk", 2`;
  const translatedJsCode = translateAmos(amosBasicCode);
  const normalizedTranslatedJsCode = translatedJsCode.replace(/\s+/g, ' ').trim();
  
  expect(normalizedTranslatedJsCode).toContain("loadBank('\"assets/icons.abk\"', 2);");
});
