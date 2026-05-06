import antlr4 from "antlr4";
import AmosToJavaScriptTranslator from "../AmosToJavaScriptTranslator";
import AMOSParser from "../grammar/generated/AMOSParser";
import AMOSLexer from "../grammar/generated/AMOSLexer";

test("statement_separator", () => {
  const amosBasicCode = `
       Screen Open 1,600,400,8,Hires : Curs Off : Text 10,10,"ReAnimate(d) Piano"
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
    document.getElementById('amos-screen').style.cursor = 'none';

    const textDiv1010 = document.createElement('div');
    textDiv1010.innerText = 'ReAnimate(d) Piano';
    textDiv1010.style.position = 'absolute';
    textDiv1010.style.left = '10px';
    textDiv1010.style.top = '10px';
    textDiv1010.style.fontSize = '14px';
    textDiv1010.style.color = 'black';
    document.getElementById('amos-screen').appendChild(textDiv1010);
  `;

  // Normalizar a string gerada e a esperada para remover quebras de linha e espaços extras
  const normalizedTranslatedJsCode = translatedJsCode.replace(/\s+/g, ' ').trim();
  const normalizedExpectedJsCode = expectedJsCode.replace(/\s+/g, ' ').trim();

  expect(normalizedTranslatedJsCode).toContain(normalizedExpectedJsCode);
});

