import antlr4 from "antlr4";
import AmosToJavaScriptTranslator from "@/src/transpiler/AmosToJavaScriptTranslator";
import AMOSParser from "../src/grammar/generated/AMOSParser";
import AMOSLexer from "../src/grammar/generated/AMOSLexer";

test("for_loop_alone", () => {
  const amosBasicCode = `
  For I=0 To 10
   Next I
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

  const normalizedTranslatedJsCode = translatedJsCode.replace(/\s+/g, ' ').trim();
  const testTarget = `for (I = 0; I <= 10; I++) {}`;

  expect(normalizedTranslatedJsCode).toContain(testTarget);


});
