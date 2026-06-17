import { translateAmos } from "../helpers/translate";

test("do_loop", () => {
  const amosBasicCode = `
  Do 

  Loop 
    `;

  const [lexErrs, parseErrs, normalizedJS] = translateAmos(amosBasicCode);
  expect(lexErrs.errors).toEqual([]);
  expect(parseErrs.errors).toEqual([]);
  
  
  // Assert against current translator output containing loop guard and setInterval
  
  
  expect(normalizedJS).toContain("let allowLoop = true;");
  expect(normalizedJS).toContain("setInterval(() => {");
  expect(normalizedJS).toContain("if (!allowLoop) return;");
  expect(normalizedJS).toContain("currentTimer = Date.now();");
  expect(normalizedJS).toContain("Timer++;");
  expect(normalizedJS).toContain("Timer = 9;");
  expect(normalizedJS).toContain("}, 16);");
});
