import antlr4 from "antlr4";
import AmosToJavaScriptTranslator from "@/src/transpiler/AmosToJavaScriptTranslator";
import AMOSParser from "../grammar/generated/AMOSParser";
import AMOSLexer from "../grammar/generated/AMOSLexer";
import fs from "fs";

test("rendering bug", () => {
  const code = `
Screen Open 1,720,720,8,Hires

A=10
B=100

Global A

Text 10,10,A
Text 10,50,B

End

Procedure TEST
  A=A+1
  B=B+1
  Text 10,100,A
  Text 10,150,B
End Proc

TEST

Text 10,200,A
Text 10,250,B
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
