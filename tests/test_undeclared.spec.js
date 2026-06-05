import antlr4 from "antlr4";
import AmosToJavaScriptTranslator from "../src/transpiler/AmosToJavaScriptTranslator.js";
import AMOSParser from "../grammar/generated/AMOSParser.js";
import AMOSLexer from "../grammar/generated/AMOSLexer.js";

test("undeclared var", () => {
  const code = `
  Screen Open 1,720,720,8,Hires
  Text 10,10,Z
  `;

  const chars = new antlr4.InputStream(code);
  const lexer = new AMOSLexer(chars);
  const tokens = new antlr4.CommonTokenStream(lexer);
  const parser = new AMOSParser(tokens);
  const tree = parser.program();

  const translator = new AmosToJavaScriptTranslator();
  const walker = new antlr4.tree.ParseTreeWalker();
  walker.walk(translator, tree);
  console.log(translator.getJavaScript());
});
