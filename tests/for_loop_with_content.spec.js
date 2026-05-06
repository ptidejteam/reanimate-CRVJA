import antlr4 from "antlr4";
import AmosToJavaScriptTranslator from "../AmosToJavaScriptTranslator";
import AMOSParser from "../grammar/generated/AMOSParser";
import AMOSLexer from "../grammar/generated/AMOSLexer";

test("for_loop_filled", () => {
  const amosBasicCode = `
  For I=0 To 10
      If Key State($10+I)
         P_DRAWKEYS[I]
         While Key State($10+I)
            Play 37+I,1
         Wend 
         P_DRAWKEYS[-1]
      End If 
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

  /* test */
  let targetString =
    `for (let I = 0; I <= 10; I++) {

  if (currentPressedKey === keyMapping[16+I]) {



      P_DRAWKEYS(I); // Function call


    if (currentPressedKey === keyMapping[16+I]) {

    soundPlayer(37+I, 1*1000);

    }
      P_DRAWKEYS(-1); // Function call


}}`


  // Normalizar a string gerada e a esperada para remover quebras de linha e espaços extras
  const normalizedTranslatedJsCode = translatedJsCode.replace(/\s+/g, ' ').trim();
  const normalizedExpectedJsCode = targetString.replace(/\s+/g, ' ').trim();
  expect(normalizedTranslatedJsCode).toContain(normalizedExpectedJsCode);
});
