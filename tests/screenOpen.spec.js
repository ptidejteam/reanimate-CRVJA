import { translateAmos } from "./helpers/translate";

function translate(code) {
  const [lexErrs, parseErrs, normalizedJS] = translateAmos(code);
  expect(lexErrs.errors).toEqual([]);
  expect(parseErrs.errors).toEqual([]);
  return normalizedJS.replace(/\s+/g, " ").trim();
}

test("screen_open", () => {

  const amosBasicCode = `
        Screen Open 1,600,400,8,Hires
    `;

  const normalizedJS = translate(amosBasicCode);
  
  const expectedJsCode = `
  const screenDiv = document.createElement('div');
  screenDiv.style.width = '600px';
  screenDiv.style.height = '400px';
  screenDiv.style.border = '1px solid black';
  screenDiv.style.overflow = 'hidden'; 
  screenDiv.style.padding = '0'; 
  screenDiv.style.position = 'relative'; 
  screenDiv.id = 'amos-screen'; 
  screenDiv.style.zIndex = 1;
  document.getElementById('game-container').appendChild(screenDiv);
  document.getElementById('amos-screen').style.backgroundColor = 'black';
`;

  const normalizedExpectedJsCode = expectedJsCode.replace(/\s+/g, ' ').trim();

  expect(normalizedJS).toContain(normalizedExpectedJsCode);
});

