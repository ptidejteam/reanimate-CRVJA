import { translateAmos } from "../helpers/translate";

test("string assignments and procedure arguments", () => {
  const amosBasicCode = `
Screen Open 1,720,720,8,Hires

Procedure TWINS[A$]
  Text 10,20,A$
End Proc

A$ = "Twins"
TWINS[A$]
  `;

  const [lexErrs, parseErrs, normalizedJS] = translateAmos(amosBasicCode);
  expect(lexErrs.errors).toEqual([]);
  expect(parseErrs.errors).toEqual([]);
  

  

  // Check that A$ is correctly defined as a string variable
  expect(normalizedJS).toContain('A$ = "Twins";');

  // Check that procedure definition accepts A$ parameter
  expect(normalizedJS).toContain('const TWINS = (A$) => {');

  // Check that the TWINS procedure is called with A$ argument
  expect(normalizedJS).toContain('TWINS(A$);');
});
