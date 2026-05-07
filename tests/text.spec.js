import antlr4 from "antlr4";
import AmosToJavaScriptTranslator from "@/src/transpiler/AmosToJavaScriptTranslator";
import AMOSParser from "../grammar/generated/AMOSParser";
import AMOSLexer from "../grammar/generated/AMOSLexer";

test("Text", () => {

  const amosBasicCode = `
        Text 10,10,"ReAnimate(d) Piano"
    `;

  /* construct */

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
    `const textDiv1010 = document.createElement('div');
  textDiv1010.innerText = 'ReAnimate(d) Piano';
  textDiv1010.style.position = 'absolute';
  textDiv1010.style.left = '10px';
  textDiv1010.style.top = '10px';
  textDiv1010.style.fontSize = '14px';
  textDiv1010.style.color = 'black';
  document.getElementById('amos-screen').appendChild(textDiv1010);`
  /* test */
  const normalizedTranslatedJsCode = translatedJsCode.replace(/\s+/g, ' ').trim();
  const normalizedExpectedJsCode = targetString.replace(/\s+/g, ' ').trim();
  expect(normalizedTranslatedJsCode).toContain(normalizedExpectedJsCode);

});
