import { translateAmos } from "./helpers/translate";

test("Text", () => {
  const amosBasicCode = `
        Text 10,10,"ReAnimate(d) Piano"
    `;

  const translatedJsCode = translateAmos(amosBasicCode);
  console.log("TRANSLATED_CODE:\n" + translatedJsCode);
  const normalizedTranslatedJsCode = translatedJsCode.replace(/\s+/g, ' ').trim();

  expect(normalizedTranslatedJsCode).toContain("const textDiv1010 = document.createElement('div');");
  expect(normalizedTranslatedJsCode).toContain("textDiv1010.innerText = 'ReAnimate(d) Piano';");
  expect(normalizedTranslatedJsCode).toContain("textDiv1010.id = 'textDiv' + '10' + '10';");
  expect(normalizedTranslatedJsCode).toContain("textDiv1010.style.position = 'absolute';");
  expect(normalizedTranslatedJsCode).toContain("textDiv1010.style.left = '10px';");
  expect(normalizedTranslatedJsCode).toContain("textDiv1010.style.top = '10px';");
  expect(normalizedTranslatedJsCode).toContain("textDiv1010.style.fontSize = '14px';");
  expect(normalizedTranslatedJsCode).toContain("textDiv1010.style.color = Ink;");
  expect(normalizedTranslatedJsCode).toContain("textDiv1010.style.position = \"Relative\";");
  expect(normalizedTranslatedJsCode).toContain("textDiv1010.style.zIndex = 99;");
  expect(normalizedTranslatedJsCode).toContain("document.getElementById('amos-screen').appendChild(textDiv1010);");
});
