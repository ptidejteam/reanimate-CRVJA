import antlr4 from "antlr4";
import AmosToJavaScriptTranslator from "@/src/transpiler/AmosToJavaScriptTranslator";
import AMOSParser from "../grammar/generated/AMOSParser";
import AMOSLexer from "../grammar/generated/AMOSLexer";

test("variables_fetcher", () => {

   const amosBasicCode = `
  'REANIMATE PIANO 
'BY GABRIEL C. ULLMANN, YANN-GAËL GUÉHÉNEUC, 2024 
'INSPIRED BY: https://www.youtube.com/watch?v=iW-v7SpgS9Q

'Draw title and keys 
'******************* 
Screen Open 1,600,400,8,Hires
Curs Off 
Ink 2
Text 10,10,"ReAnimate(d) Piano"
Text 10,20,"By Gabriel C. Ullmann, 2024"
P_DRAWKEYS[-1]


'Wait for a key, draw the keyboard, play the sound 
'************************************************* 
Do 
   Wait Key 
   For I=0 To 10
      If Key State($10+I)
         P_DRAWKEYS[I]
         While Key State($10+I)
            Play 37+I,1
		         Wend 
         P_DRAWKEYS[-1]
      End If 
   Next I
Loop 



Procedure P_DRAWKEYS[PRESSEDKEYNUMBER]
   'White key positions 
   '******************* 
   XW=70
   YW=70
   WW=50
   HW=100
   
   'Black key positions 
   '******************* 
   XB=XW+WW
   YB=70
   WB=30
   HB=60
   
   'Draw keys 
   '*********   
   For I=0 To 5
      'Draw white keys 
      '***************     
      'Set color, either white or green (pressed)  
      '******************************************
      If PRESSEDKEYNUMBER=2*I
         Ink 5
      Else 
         Ink 2
      End If 
      Bar XW+(I*(WB+WW)),YW To XW+((WB+WW)*I+WW),YW+HW
      
      'If last iteration, do not draw a black key  
      '******************************************  
      If I<>5 
         If PRESSEDKEYNUMBER=2*I+1
            Ink 5
         Else 
            Ink 0
         End If 
         Bar XB+((WB+WW)*I),YB To XB+((WB+WW)*I+WB+WW),YB+HB
      End If 
   Next I
End Proc
End 

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
   let targetString =
      `  
let XW = 70;
let YW = 70;
let WW = 50;
let HW = 100;
let XB = XW+WW;
let YB = 70;
let WB = 30;
let HB = 60;
  `
   /* test */
   const normalizedTranslatedJsCode = translatedJsCode.replace(/\s+/g, ' ').trim();
   const normalizedExpectedJsCode = targetString.replace(/\s+/g, ' ').trim();
   expect(normalizedTranslatedJsCode).toContain(normalizedExpectedJsCode);
   /* test */


});
