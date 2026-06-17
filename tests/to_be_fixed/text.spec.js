import { translateAmos } from "../helpers/translate";

test("Text", () => {
  const amosBasicCode = `
        Text 10,10,"ReAnimate(d) Piano"
    `;

  const [lexErrs, parseErrs, normalizedJS] = translateAmos(amosBasicCode);
  expect(lexErrs.errors).toEqual([]);
  expect(parseErrs.errors).toEqual([]);
  
  console.log("TRANSLATED_CODE:\n" + normalizedJS);
  

  expect(normalizedJS).toContain("const textDiv1010 = document.createElement('div');");
  expect(normalizedJS).toContain("textDiv1010.innerText = 'ReAnimate(d) Piano';");
  expect(normalizedJS).toContain("textDiv1010.id = 'textDiv' + '10' + '10';");
  expect(normalizedJS).toContain("textDiv1010.style.position = 'absolute';");
  expect(normalizedJS).toContain("textDiv1010.style.left = '10px';");
  expect(normalizedJS).toContain("textDiv1010.style.top = '10px';");
  expect(normalizedJS).toContain("textDiv1010.style.fontSize = '14px';");
  expect(normalizedJS).toContain("textDiv1010.style.color = Ink;");
  expect(normalizedJS).toContain("textDiv1010.style.position = \"Relative\";");
  expect(normalizedJS).toContain("textDiv1010.style.zIndex = 99;");
  expect(normalizedJS).toContain("document.getElementById('amos-screen').appendChild(textDiv1010);");
});
