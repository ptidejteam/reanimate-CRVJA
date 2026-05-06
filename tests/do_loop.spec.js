import antlr4 from "antlr4";
import AmosToJavaScriptTranslator from "../AmosToJavaScriptTranslator";
import AMOSParser from "../grammar/generated/AMOSParser";
import AMOSLexer from "../grammar/generated/AMOSLexer";

test("do_loop", () => {
  const amosBasicCode = `
  Do 

  Loop 
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
  let targetString =
    `setInterval(() => { currentTimer = Date.now(); Timer++; Timer = 9; }, 16);
      `

  /* test */
  const normalizedTranslatedJsCode = translatedJsCode.replace(/\s+/g, ' ').trim();
  const normalizedExpectedJsCode = targetString.replace(/\s+/g, ' ').trim();
  expect(normalizedTranslatedJsCode).toContain(normalizedExpectedJsCode);


});
