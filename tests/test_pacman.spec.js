import antlr4 from "antlr4";
import AmosToJavaScriptTranslator from "@/src/transpiler/AmosToJavaScriptTranslator";
import AMOSParser from "../grammar/generated/AMOSParser";
import AMOSLexer from "../grammar/generated/AMOSLexer";
import fs from "fs";

test("compile pacman", () => {
  const code = fs.readFileSync("public/AmosFiles/Pacman.txt", "utf-8");

  const chars = new antlr4.InputStream(code);
  const lexer = new AMOSLexer(chars);
  const tokens = new antlr4.CommonTokenStream(lexer);
  const parser = new AMOSParser(tokens);
  const tree = parser.program();

  const translator = new AmosToJavaScriptTranslator();
  const walker = new antlr4.tree.ParseTreeWalker();
  walker.walk(translator, tree);
  
  fs.writeFileSync("pacman_output.js", translator.getJavaScript());
});
