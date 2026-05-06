import antlr4 from "antlr4";
import AmosToJavaScriptTranslator from "../AmosToJavaScriptTranslator";
import AMOSParser from "../grammar/generated/AMOSParser";
import AMOSLexer from "../grammar/generated/AMOSLexer";

test("screen_open", () => {

  const amosBasicCode = `
        Screen Open 1,600,400,8,Hires
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
  const expectedJsCode = `
  const screenDiv = document.createElement('div');
  screenDiv.style.width = '600px';
  screenDiv.style.height = '400px';
  screenDiv.style.border = '1px solid red';
  screenDiv.style.overflow = 'hidden';
  screenDiv.style.padding = '0';
  screenDiv.style.position = 'relative';
  screenDiv.id = 'amos-screen';
  screenDiv.style.zIndex = 1;
  document.getElementById('game-container').appendChild(screenDiv);
  document.getElementById('amos-screen').style.backgroundColor = colorMapping[8];

`;

  // Normalizar a string gerada e a esperada para remover quebras de linha e espaços extras
  const normalizedTranslatedJsCode = translatedJsCode.replace(/\s+/g, ' ').trim();
  const normalizedExpectedJsCode = expectedJsCode.replace(/\s+/g, ' ').trim();

  expect(normalizedTranslatedJsCode).toContain(normalizedExpectedJsCode);


});
