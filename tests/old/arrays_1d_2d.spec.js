import { translateAmos } from "./helpers/translate";

test("1D arrays creation, update and global reference", () => {
  const amosBasicCode = `
  Dim C(5)
  Global C()
  C(0) = 10
  `;

  const [lexicalErrs, syntacticErrs, translated] = translateAmos(amosBasicCode);
 
  expect(lexicalErrs).empty();
  expect(syntacticErrs).empty();

  // Dim C(5) creates an array of size 6 (0 to 5)
  expect(translated).toContain("const C = Array(5).fill(0);");
  // C(0) = 10 updates the array element
  expect(translated).toContain("C[Math.trunc(0)] = 10;");
});

test("2D arrays creation, update and global reference", () => {
  const amosBasicCode = `
  Dim S(2,2)
  Global S(1)
  S(1,0) = 20
  Text 100,100,S(1,0)
  `;

  const translated = translateAmos(amosBasicCode);
 
  // Dim S(2,2) creates a 3x3 2D array
  expect(translated).toContain("const S = Array(2).fill(0).map(x => Array(2).fill(0));");
  // S(1,0) = 20 updates element at y=0, x=1 => S[0][1] = 20
  expect(translated).toContain("S[Math.trunc(1)][Math.trunc(0)] = 20;");
});
