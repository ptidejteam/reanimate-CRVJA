import { translateAmos } from "./helpers/translate";

test("statement_separator", () => {
  const amosBasicCode = `
       Screen Open 1,600,400,8,Hires : Curs Off : Text 10,10,"ReAnimate(d) Piano"
    `;

  const translatedJsCode = translateAmos(amosBasicCode);
  const normalizedTranslatedJsCode = translatedJsCode.replace(/\s+/g, ' ').trim();

  // Screen Open assertions
  expect(normalizedTranslatedJsCode).toContain("const screenDiv = document.createElement('div');");
  expect(normalizedTranslatedJsCode).toContain("screenDiv.style.width = '600px';");
  expect(normalizedTranslatedJsCode).toContain("screenDiv.style.height = '400px';");
  expect(normalizedTranslatedJsCode).toContain("screenDiv.id = 'amos-screen';");
  expect(normalizedTranslatedJsCode).toContain("screenDiv.style.zIndex = 1;");
  expect(normalizedTranslatedJsCode).toContain("document.getElementById('game-container').appendChild(screenDiv);");
  expect(normalizedTranslatedJsCode).toContain("document.getElementById('amos-screen').style.backgroundColor = colorMapping[8];");

  // Curs Off assertion
  expect(normalizedTranslatedJsCode).toContain("document.getElementById('amos-screen').style.cursor = 'none';");

  // Text assertions (matching current translator output)
  expect(normalizedTranslatedJsCode).toContain("const textDiv1010 = document.createElement('div');");
  expect(normalizedTranslatedJsCode).toContain("textDiv1010.innerText = 'ReAnimate(d) Piano';");
  expect(normalizedTranslatedJsCode).toContain("textDiv1010.id = 'textDiv' + '10' + '10';");
  expect(normalizedTranslatedJsCode).toContain("textDiv1010.style.color = Ink;");
  expect(normalizedTranslatedJsCode).toContain("textDiv1010.style.position = \"Relative\";");
  expect(normalizedTranslatedJsCode).toContain("textDiv1010.style.zIndex = 99;");
  expect(normalizedTranslatedJsCode).toContain("document.getElementById('amos-screen').appendChild(textDiv1010);");
});

