import antlr4 from "antlr4";
import AmosToJavaScriptTranslator from "../AmosToJavaScriptTranslator";
import AMOSParser from "../grammar/generated/AMOSParser";
import AMOSLexer from "../grammar/generated/AMOSLexer";

test("load_banks", () => {
  /* 
    const amosBasicCode = `Load "assets/icons.abk"`;
  
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
  
  
    expect(translatedJsCode).equals(
      `let iconsabk = [[kshfdkfh], [], []]`
    ); */

});
