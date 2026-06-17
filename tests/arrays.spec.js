import { translateAmos } from "./helpers/translate";

test("1D arrays creation, update and global reference", () => {
  const amosBasicCode = `
    Dim C(1)
    Global C(1)
    C(0) = 10
  `;

  const [lexErrs, parseErrs, translatedJS] = translateAmos(amosBasicCode);

  expect(lexErrs.errors).toEqual([]);
  expect(parseErrs.errors).toEqual([]);

  const normalizedJS = translatedJS.replace(/\s+/g, " ").trim();

  expect(normalizedJS).toContain(
    "const C = Array(1).fill(0); C[Math.trunc(0)] = 10;",
  );
});

test("2D arrays creation, update and global reference", () => {
  const amosBasicCode = `
  Dim S(2,2)
  Global S(2)
  S(1,0) = 20
  TEMP = S(1,0)
  Text 100,100,TEMP
  `;

  const [lexErrs, parseErrs, translatedJS] = translateAmos(amosBasicCode);

  expect(lexErrs.errors).toEqual([]);
  expect(parseErrs.errors).toEqual([]);
  const normalizedJS = translatedJS.replace(/\s+/g, " ").trim();

  // Dim S(2,2)
  expect(normalizedJS).toContain(
    "const S = Array(2).fill(0).map(x => Array(2).fill(0));",
  );
  // S(1,0) = 20
  expect(normalizedJS).toContain("S[Math.trunc(1)][Math.trunc(0)] = 20;");
});
