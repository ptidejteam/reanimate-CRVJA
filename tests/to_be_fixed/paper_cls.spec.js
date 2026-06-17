import { translateAmos } from "../helpers/translate";
import fs from "fs";

function translate(code) {
  const [lexErrs, parseErrs, normalizedJS] = translateAmos(code);
  expect(lexErrs.errors).toEqual([]);
  expect(parseErrs.errors).toEqual([]);
  return normalizedJS.replace(/\s+/g, " ").trim();
}

test("paper and pen translation", () => {
  const amosCode = `
    Paper 0
    Pen 3
  `;
  const normalizedJS = translate(amosCode);
  expect(normalizedJS).toContain("Paper = 0;");
  expect(normalizedJS).toContain("Pen = 3;");
});

test("parameterless cls uses paper variable", () => {
  const amosCode = `
    Paper 0
    Cls
  `;
  const normalizedJS = translate(amosCode);
  expect(normalizedJS).toContain("Paper = 0;");
  expect(normalizedJS).toContain("amosScreen.style.backgroundColor = colorMapping[Paper + 1] || \"black\";");
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
  const normalizedJS = translate(amosCode);

  // Check Screen Open
  expect(normalizedJS).toContain("screenDiv.id = 'amos-screen';");
  
  // Check Curs Off
  expect(normalizedJS).toContain("document.getElementById('amos-screen').style.cursor = 'none';");

  // Check Paper and Cls
  expect(normalizedJS).toContain("Paper = 0;");
  expect(normalizedJS).toContain("amosScreen.style.backgroundColor = colorMapping[Paper + 1] || \"black\";");

  // Check Ink and Text
  expect(normalizedJS).toContain("Ink = colorMapping[(2) + 1] || \"black\";"); 
  expect(normalizedJS).toContain("textDiv15030.innerText = 'My First CRVJA Program!';");

  // Check Ink and Circle
  expect(normalizedJS).toContain("Ink = colorMapping[(5) + 1] || \"black\";");
  expect(normalizedJS).toContain("const circleId = \"Circle_\" + (300) + \"_\" + (200) + \"_\" + (80);");
});

test("compilation of rotating triangle program", () => {
  const amosCode = fs.readFileSync("public/Examples/Example3_Rotating_Triangle/Example3_Rotating_Triangle.asc", "utf-8");
  const normalizedJS = translate(amosCode);

  // Check that Turbo Draw sets color using the dynamic (colorIndex) + 1 mapping
  expect(normalizedJS).toContain("colorMapping[(1) + 1]");
});

