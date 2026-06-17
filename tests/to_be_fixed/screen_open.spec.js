import { translateAmos } from "../helpers/translate";

test("screen_open", () => {

  const amosBasicCode = `
        Screen Open 1,600,400,8,Hires
    `;

  const [lexErrs, parseErrs, normalizedJS] = translateAmos(amosBasicCode);
  expect(lexErrs.errors).toEqual([]);
  expect(parseErrs.errors).toEqual([]);
  

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
  
  const normalizedExpectedJsCode = expectedJsCode.replace(/\s+/g, ' ').trim();

  expect(normalizedJS).toContain(normalizedExpectedJsCode);


});
