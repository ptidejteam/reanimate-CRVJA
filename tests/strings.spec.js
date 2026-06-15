import antlr4 from "antlr4";
import AmosToJavaScriptTranslator from "@/src/transpiler/AmosToJavaScriptTranslator";
import AMOSParser from "../src/grammar/generated/AMOSParser";
import AMOSLexer from "../src/grammar/generated/AMOSLexer";

test("string assignments and procedure arguments", () => {
  const amosBasicCode = `
Screen Open 1,720,720,8,Hires

Procedure TWINS[A$]
  Text 10,20,A$
End Proc

A$ = "Twins"
TWINS[A$]
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
  const translatedJsCode = translator.getJavaScript();

  const normalized = translatedJsCode.replace(/\s+/g, ' ').trim();

  // Check that A$ is correctly defined as a string variable
  expect(normalized).toContain('A$ = "Twins";');

  // Check that procedure definition accepts A$ parameter
  expect(normalized).toContain('const TWINS = (A$) => {');

  // Check that the TWINS procedure is called with A$ argument
  expect(normalized).toContain('TWINS(A$);');
});
