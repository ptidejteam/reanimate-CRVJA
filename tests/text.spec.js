import { translateAmos } from "./helpers/translate";

function translate(code) {
  const [lexErrs, parseErrs, normalizedJS] = translateAmos(code);
  expect(lexErrs.errors).toEqual([]);
  expect(parseErrs.errors).toEqual([]);
  return normalizedJS.replace(/\s+/g, " ").trim();
}

test("Text", () => {
  const amosBasicCode = `
        Text 10,10,"Hello, World!"
    `;

  const normalizedJS = translate(amosBasicCode);
  
  const expectedJsCode = `
    const textDiv1010 = document.createElement('div');
    textDiv1010.innerText = "Hello, World!";
    textDiv1010.id = 'textDiv1010' + Math.random();
    textDiv1010.style.position = 'absolute';
    textDiv1010.style.left = '10px';
    textDiv1010.style.top = '10px';
    textDiv1010.style.fontSize = '14px';
    textDiv1010.style.color = getColour(Ink);
    textDiv1010.style.backgroundColor = getColour(Paper);
    textDiv1010.style.zIndex = 99;
    document.getElementById('amos-screen').appendChild(textDiv1010);
  `;

  const normalizedExpectedJsCode = expectedJsCode.replace(/\s+/g, ' ').trim();
  expect(normalizedJS).toContain(normalizedExpectedJsCode);
});

