import antlr4 from "antlr4";
import AmosToJavaScriptTranslator from "@/src/transpiler/AmosToJavaScriptTranslator";
import AMOSParser from "@/grammar/generated/AMOSParser";
import AMOSLexer from "@/grammar/generated/AMOSLexer";
import fs from "fs";

test("scratch debug", () => {
  const amosBasicCode = "Curs On\n";
  const chars = new antlr4.InputStream(amosBasicCode);
  const lexer = new AMOSLexer(chars);
  const tokens = new antlr4.CommonTokenStream(lexer);
  const parser = new AMOSParser(tokens);

  const tree = parser.program();
  const ast = tree.toStringTree(parser.ruleNames);

  const translator = new AmosToJavaScriptTranslator();
  const walker = new antlr4.tree.ParseTreeWalker();
  walker.walk(translator, tree);
  const js = translator.getJavaScript();

  fs.writeFileSync("/Users/viniciusmioto/Files/scratch/debug_output.txt", `AST Tree:\n${ast}\n\nGenerated JS:\n${js}`);
});
