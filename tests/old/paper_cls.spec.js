import antlr4 from "antlr4";
import AmosToJavaScriptTranslator from "@/src/transpiler/AmosToJavaScriptTranslator";
import AMOSParser from "@/src/grammar/generated/AMOSParser";
import AMOSLexer from "@/src/grammar/generated/AMOSLexer";
import fs from "fs";

function translate(code) {
  const chars = new antlr4.InputStream(code);
  const lexer = new AMOSLexer(chars);
  const tokens = new antlr4.CommonTokenStream(lexer);
  const parser = new AMOSParser(tokens);
  const tree = parser.program();

  const translator = new AmosToJavaScriptTranslator();
  const walker = new antlr4.tree.ParseTreeWalker();
  walker.walk(translator, tree);
  return translator.getJavaScript();
}

test("paper and pen translation", () => {
  const amosCode = `
    Paper 0
    Pen 3
  `;
  const jsCode = translate(amosCode);
  expect(jsCode).toContain("Paper = 0;");
  expect(jsCode).toContain("Pen = 3;");
});

test("parameterless cls uses paper variable", () => {
  const amosCode = `
    Paper 0
    Cls
  `;
  const jsCode = translate(amosCode);
  expect(jsCode).toContain("Paper = 0;");
  expect(jsCode).toContain("amosScreen.style.backgroundColor = colorMapping[Paper + 1] || \"black\";");
});

test("compilation of user's sample program", () => {
  const amosCode = `
    Screen Open 1, 600, 400, 8, Hires
    Curs Off

    ' 2. Setup the background
    Paper 0
    Cls

    ' 3. Write a title
    Ink 2
    Text 150, 30, "My First CRVJA Program!"

    ' 4. Draw a big circle in the middle
    Ink 5
    Circle 300, 200, 80
  `;
  const jsCode = translate(amosCode);

  // Check Screen Open
  expect(jsCode).toContain("screenDiv.id = 'amos-screen';");
  
  // Check Curs Off
  expect(jsCode).toContain("document.getElementById('amos-screen').style.cursor = 'none';");

  // Check Paper and Cls
  expect(jsCode).toContain("Paper = 0;");
  expect(jsCode).toContain("amosScreen.style.backgroundColor = colorMapping[Paper + 1] || \"black\";");

  // Check Ink and Text
  expect(jsCode).toContain("Ink = colorMapping[(2) + 1] || \"black\";"); 
  expect(jsCode).toContain("textDiv15030.innerText = 'My First CRVJA Program!';");

  // Check Ink and Circle
  expect(jsCode).toContain("Ink = colorMapping[(5) + 1] || \"black\";");
  expect(jsCode).toContain("const circleId = \"Circle_\" + (300) + \"_\" + (200) + \"_\" + (80);");
});

test("compilation of rotating triangle program", () => {
  const amosCode = fs.readFileSync("public/AmosFiles/Amos2_Rotating_Triangle.txt", "utf-8");
  const jsCode = translate(amosCode);

  // Check that Turbo Draw sets color using the dynamic (colorIndex) + 1 mapping
  expect(jsCode).toContain("colorMapping[(1) + 1]");
});

