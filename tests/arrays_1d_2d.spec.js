import { translateAmos } from "./helpers/translate";

test("1D arrays creation, update and global reference", () => {
  const amosBasicCode = `
  Dim C(5)
  Global C()
  C(0) = 10
  `;

  const translated = translateAmos(amosBasicCode);
  const normalized = translated.replace(/\s+/g, ' ').trim();

  // Dim C(5) creates an array of size 6 (0 to 5)
  expect(normalized).toContain("const C = new Array(6);");
  // C(0) = 10 updates the array element
  expect(normalized).toContain("C[0] = 10;");
});

test("2D arrays creation, update and global reference", () => {
  const amosBasicCode = `
  Dim S(2,2)
  Global S()
  S(1,0) = 20
  `;

  const translated = translateAmos(amosBasicCode);
  const normalized = translated.replace(/\s+/g, ' ').trim();

  // Dim S(2,2) creates a 3x3 2D array
  expect(normalized).toContain("const S = new Array(3);");
  expect(normalized).toContain("for (let i = 0; i < 3; i++) S[i] = new Array(3);");
  // S(1,0) = 20 updates element at y=0, x=1 => S[0][1] = 20
  expect(normalized).toContain("S[0][1] = 20;");
});
