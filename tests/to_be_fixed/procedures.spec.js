import { translateAmos } from "../helpers/translate";

test("procedures", () => {

  const amosBasicCode = `
  Procedure P_DRAWKEYS[PRESSEDKEYNUMBER]
  End Proc
    `;

  const [lexErrs, parseErrs, normalizedJS] = translateAmos(amosBasicCode);
  expect(lexErrs.errors).toEqual([]);
  expect(parseErrs.errors).toEqual([]);
  

  /* test */
  const expectedJsCode = `let lastTimeP_DRAWKEYS = 0; 
  let timeoutIdP_DRAWKEYS = null; // Track the timeout ID 
  const P_DRAWKEYS = (PRESSEDKEYNUMBER) => { 
    const currentTime = Date.now(); 
    const timeSinceLastCall = currentTime - lastTimeP_DRAWKEYS; 
    if (timeSinceLastCall < 16) { 
    if (timeoutIdP_DRAWKEYS) clearTimeout(timeoutIdP_DRAWKEYS); // Clear any existing timeout 
    timeoutIdP_DRAWKEYS = setTimeout(() => { P_DRAWKEYS(PRESSEDKEYNUMBER); }, 100 - timeSinceLastCall); 
    return; } lastTimeP_DRAWKEYS = currentTime; timeoutIdP_DRAWKEYS = null; // Clear the timeout ID after execution }
`;

  // Normalizar a string gerada e a esperada para remover quebras de linha e espaços extras
  
  const normalizedExpectedJsCode = expectedJsCode.replace(/\s+/g, ' ').trim();

  expect(normalizedJS).toContain(normalizedExpectedJsCode);


});

test("procedure calls translation with and without parameters", () => {
  const amosBasicCode = `
  Procedure HELLO
    Text 10,10,"Hello World"
  End Proc
  
  Procedure TWINS[A,B]
    Text 10,20,"Twins"
  End Proc
  
  HELLO
  TWINS[6,9]
  `;

  const [lexErrs, parseErrs, normalizedJS] = translateAmos(amosBasicCode);
  expect(lexErrs.errors).toEqual([]);
  expect(parseErrs.errors).toEqual([]);
  

  

  // Assert that HELLO was called
  expect(normalizedJS).toContain("HELLO();");

  // Assert that TWINS was called with arguments 6 and 9
  expect(normalizedJS).toContain("TWINS(6, 9);");
});
