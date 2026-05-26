import antlr4 from "antlr4";
import AmosToJavaScriptTranslator from "@/src/transpiler/AmosToJavaScriptTranslator";
import AMOSParser from "../grammar/generated/AMOSParser";
import AMOSLexer from "../grammar/generated/AMOSLexer";

test("procedures", () => {

  const amosBasicCode = `
  Procedure P_DRAWKEYS[PRESSEDKEYNUMBER]
  End Proc
    `;

  const chars = new antlr4.InputStream(amosBasicCode);
  const lexer = new AMOSLexer(chars);
  const tokens = new antlr4.CommonTokenStream(lexer);
  const parser = new AMOSParser(tokens);

  const tree = parser.program();

  // Translate the parsed AMOS BASIC into JavaScript
  const translator = new AmosToJavaScriptTranslator();
  const walker = new antlr4.tree.ParseTreeWalker();
  walker.walk(translator, tree);
  const translatedJsCode = translator.getJavaScript(); // Get the translated JavaScript code

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
  const normalizedTranslatedJsCode = translatedJsCode.replace(/\s+/g, ' ').trim();
  const normalizedExpectedJsCode = expectedJsCode.replace(/\s+/g, ' ').trim();

  expect(normalizedTranslatedJsCode).toContain(normalizedExpectedJsCode);


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

  const chars = new antlr4.InputStream(amosBasicCode);
  const lexer = new AMOSLexer(chars);
  const tokens = new antlr4.CommonTokenStream(lexer);
  const parser = new AMOSParser(tokens);
  const tree = parser.program();

  const translator = new AmosToJavaScriptTranslator();
  const walker = new antlr4.tree.ParseTreeWalker();
  walker.walk(translator, tree);
  const translatedJsCode = translator.getJavaScript();

  const normalized = translatedJsCode.replace(/\s+/g, ' ').trim();

  // Assert that HELLO was called
  expect(normalized).toContain("HELLO();");

  // Assert that TWINS was called with arguments 6 and 9
  expect(normalized).toContain("TWINS(6, 9);");
});
