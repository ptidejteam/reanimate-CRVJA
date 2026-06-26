import { translateAmos } from "./helpers/translate";

function translate(code) {
  const [lexErrs, parseErrs, normalizedJS] = translateAmos(code);
  expect(lexErrs.errors).toEqual([]);
  expect(parseErrs.errors).toEqual([]);
  return normalizedJS.replace(/\s+/g, " ").trim();
}

// now generating RND_VAR = Rnd(10);randomInt(42)
test("generate a random number", () => {
  const amosCode = `
    RND_VAR = Rnd(10)
  `;
  const normalizedJS = translate(amosCode);
  expect(normalizedJS).toContain("let RND_VAR = 0;");
  expect(normalizedJS).toContain("RND_VAR = randomInt(42);");
}); 

