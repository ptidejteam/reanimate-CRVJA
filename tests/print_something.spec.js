import antlr4 from "antlr4";
import AmosToJavaScriptTranslator from "@/src/transpiler/AmosToJavaScriptTranslator";
import AMOSParser from "../grammar/generated/AMOSParser";
import AMOSLexer from "../grammar/generated/AMOSLexer";

test("print_something", () => {
  const amosBasicCode = `Print 500/Timer;" FPS"`;

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

  let targetString = `const finder_printDiv0 = document.getElementById('printDiv0' + '500/Timer'); 
  if(finder_printDiv0){finder_printDiv0.remove();} 
  const printDiv0 = document.createElement('div'); 
  printDiv0.innerText = '500/Timer'; 
  printDiv0.style.position = 'relative'; 
  printDiv0.style.left = '50%'; 
  printDiv0.style.top = '50%'; 
  printDiv0.style.fontSize = '14px'; 
  printDiv0.style.color = 'black'; 
  printDiv0.id = 'printDiv0' + '500/Timer'; 
  document.getElementById('amos-screen').appendChild(printDiv0); 
  
  const finder_printDiv1 = document.getElementById('printDiv1' + '\" FPS\"'); if(finder_printDiv1){finder_printDiv1.remove();} const printDiv1 = document.createElement('div'); 
   printDiv1.innerText = (\" FPS\").toString(); 
   printDiv1.style.position = 'relative'; 
   printDiv1.style.left = '50%'; 
   printDiv1.style.top = '50%'; 
   printDiv1.style.fontSize = '14px'; 
   printDiv1.style.color = 'black'; 
   printDiv1.id = 'printDiv1' + '\" FPS\"'; document.getElementById('amos-screen').appendChild(printDiv1);`;
  /* test */
  const normalizedTranslatedJsCode = translatedJsCode
    .replace(/\s+/g, " ")
    .trim();
  const normalizedExpectedJsCode = targetString.replace(/\s+/g, " ").trim();
  expect(normalizedTranslatedJsCode).toContain(normalizedExpectedJsCode);
});
