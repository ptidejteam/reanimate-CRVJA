import antlr4 from "antlr4";
import AmosToJavaScriptTranslator from "@/src/transpiler/AmosToJavaScriptTranslator";
import AMOSParser from "../src/grammar/generated/AMOSParser";
import AMOSLexer from "../src/grammar/generated/AMOSLexer";

test("max_int_size", () => {
  const amosBasicCode = `
   XW=2147483648
  `;

  const chars = new antlr4.InputStream(amosBasicCode);
  const lexer = new AMOSLexer(chars);
  const tokens = new antlr4.CommonTokenStream(lexer);
  const parser = new AMOSParser(tokens);

  const tree = parser.program();

  // Translate the parsed AMOS BASIC into JavaScript
  const translator = new AmosToJavaScriptTranslator();
  const walker = new antlr4.tree.ParseTreeWalker();

  // Capture the error using a try-catch block
  try {
    walker.walk(translator, tree);
    const translatedJsCode = translator.getJavaScript(); // Get the translated JavaScript code
  } catch (error) {
    // Verify that the error message is as expected
    expect(error.message).toBe(`ERROR: Amos code line 2: Value for variable "XW" exceeds the allowed limit of 2,147,483,647.`);
  }
});
