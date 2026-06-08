import antlr4 from "antlr4";
import AmosToJavaScriptTranslator from "@/src/transpiler/AmosToJavaScriptTranslator";
import AMOSParser from "../grammar/generated/AMOSParser";
import AMOSLexer from "../grammar/generated/AMOSLexer";
import fs from "fs";

test("compile catch the cherry example", () => {
  const code = `
' ==========================================================
' CATCH THE CHERRY - A Simple CRVJA Game
' ==========================================================

' 1. Screen and Palette Setup
Screen Open 1, 600, 400, 8, Hires
Curs Off
Paper 0 : Cls

' 2. Load Visual Assets
Load "game.abk"

' 3. Initialize Variables
PLAYER_X = 100
PLAYER_Y = 150
PLAYER_SPEED = 6

' Spawn the Cherry
CHERRY_X = 300
CHERRY_Y = 200

SCORE = 0

' 4. Main Game Loop
Do
   ' Redraw HUD (Score)
   Ink 3
   Text 10, 20, "SCORE:"
   Text 80, 20, SCORE
   
   ' Read Keyboard Controls (W/S/A/D or Arrow Keys)
   ' A Key ($1E) or Left Arrow ($70)
   If Key State($1E)
      PLAYER_X = PLAYER_X - PLAYER_SPEED
   End If
   If Key State($70)
      PLAYER_X = PLAYER_X - PLAYER_SPEED
   End If

   ' D Key ($20) or Right Arrow ($71)
   If Key State($20)
      PLAYER_X = PLAYER_X + PLAYER_SPEED
   End If
   If Key State($71)
      PLAYER_X = PLAYER_X + PLAYER_SPEED
   End If

   ' W Key ($11) or Up Arrow ($6E)
   If Key State($11)
      PLAYER_Y = PLAYER_Y - PLAYER_SPEED
   End If
   If Key State($6E)
      PLAYER_Y = PLAYER_Y - PLAYER_SPEED
   End If

   ' S Key ($1F) or Down Arrow ($73)
   If Key State($1F)
      PLAYER_Y = PLAYER_Y + PLAYER_SPEED
   End If
   If Key State($73)
      PLAYER_Y = PLAYER_Y + PLAYER_SPEED
   End If
   
   ' Clamp Player to Screen Boundary (assuming 16x16 sprite size)
   If PLAYER_X < 10
      PLAYER_X = 10
   End If
   If PLAYER_X > 570
      PLAYER_X = 570
   End If
   If PLAYER_Y < 30
      PLAYER_Y = 30
   End If
   If PLAYER_Y > 370
      PLAYER_Y = 370
   End If
   
   ' 5. Draw Sprites on Screen
   ' Draw Player (Sprite ID 1, using frame 0)
   Sprite 1, PLAYER_X, PLAYER_Y, 0
   
   ' Draw Cherry (Sprite ID 2, using frame 1)
   Sprite 2, CHERRY_X, CHERRY_Y, 1
   
   ' 6. Collision Detection (Bounding Box)
   ' Calculate absolute distances in X and Y coordinates
   DIST_X = PLAYER_X - CHERRY_X
   If DIST_X < 0
      DIST_X = 0 - DIST_X
   End If
   
   DIST_Y = PLAYER_Y - CHERRY_Y
   If DIST_Y < 0
      DIST_Y = 0 - DIST_Y
   End If
   
   ' Check if player and cherry overlap (within 16 pixels)
   If DIST_X < 16
      If DIST_Y < 16
         ' Collision! Earn points and relocate Cherry
         SCORE = SCORE + 10
         CHERRY_X = 50 + Rnd(500)
         CHERRY_Y = 50 + Rnd(300)
         
         ' Play note 37 (middle C area) for 1 second as sound effect
         Play 37, 1
         
         ' Clean previous score text by clearing HUD area
         Cls 0, 10, 5 To 200, 25
      End If
   End If
   
   ' 7. Control Frame Rate (Ticks)
   ' Wait 2 ticks (~40ms) to keep controls responsive and smooth
   Wait 2
Loop
  `;

  const chars = new antlr4.InputStream(code);
  const lexer = new AMOSLexer(chars);
  const tokens = new antlr4.CommonTokenStream(lexer);
  const parser = new AMOSParser(tokens);
  const tree = parser.program();

  const translator = new AmosToJavaScriptTranslator();
  const walker = new antlr4.tree.ParseTreeWalker();
  walker.walk(translator, tree);

  const jsOutput = translator.getJavaScript();
  console.log("Transpiled Catch the Cherry:", jsOutput);
  expect(jsOutput).toContain("loadBank");
  expect(jsOutput).toContain("renderSprite(1, PLAYER_X, PLAYER_Y, 0)");
  expect(jsOutput).toContain("renderSprite(2, CHERRY_X, CHERRY_Y, 1)");
});

test("compile sprite off statement", () => {
  const code = `
  Screen Open 1, 600, 400, 8, Hires
  Sprite Off
  `;

  const chars = new antlr4.InputStream(code);
  const lexer = new AMOSLexer(chars);
  const tokens = new antlr4.CommonTokenStream(lexer);
  const parser = new AMOSParser(tokens);
  const tree = parser.program();

  const translator = new AmosToJavaScriptTranslator();
  const walker = new antlr4.tree.ParseTreeWalker();
  walker.walk(translator, tree);

  const jsOutput = translator.getJavaScript();
  expect(jsOutput).toContain("Turn off all sprites");
  expect(jsOutput).toContain("document.getElementById('amos-screen')");
  expect(jsOutput).not.toContain("renderSprite(Off");
});

