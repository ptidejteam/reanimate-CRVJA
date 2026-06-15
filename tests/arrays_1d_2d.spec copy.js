import { translateAmos } from "./helpers/translate";

test("1D arrays creation, update and global reference", () => {
  const amosBasicCode = `
  Dim C(5)
  Global C()
  C(0) = 10
  `;

  const [lexErrs, parseErrs, translated] = translateAmos(amosBasicCode);
  expect(lexErrs).notEmpty();
});

test("2D arrays creation, update and global reference", () => {
  const amosBasicCode = `
  Dim S(2,2)
  Global S()
  S(1,0) = 20
  Text 100,100,S(1,0)
  `;

  const translated = translateAmos(amosBasicCode);
  // const normalized = translated.replace(/\s+/g, ' ').trim();

  // Dim S(2,2) creates a 3x3 2D array
  expect(translated).toContain("const S = Array(2).fill(0).map(x => Array(2).fill(0));");
  // S(1,0) = 20 updates element at y=0, x=1 => S[0][1] = 20
  expect(translated).toContain("S[Math.trunc(1)][Math.trunc(0)] = 20;");
});
