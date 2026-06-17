import { translateAmos } from "../helpers/translate";

test("modify_array", () => {

  const amosBasicCode = `
  C(I)=256*Cos(I) : S(I)=256*Sin(I)
    `;

  const [lexErrs, parseErrs, normalizedJS] = translateAmos(amosBasicCode);
  expect(lexErrs.errors).toEqual([]);
  expect(parseErrs.errors).toEqual([]);
  
  let targetString =
    `
  C[I] = 256*Cos(I);
  S[I] = 256*Sin(I);
  `

  /* test */
  
  const normalizedExpectedJsCode = targetString.replace(/\s+/g, ' ').trim();
  expect(normalizedJS).toContain(normalizedExpectedJsCode);


});