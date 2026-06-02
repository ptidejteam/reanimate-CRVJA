import { translateAmos } from "./helpers/translate";

test("create_array", () => {
  const amosBasicCode = `
  Dim C(359),S(359)
    `;

  const translatedJsCode = translateAmos(amosBasicCode);

  expect(translatedJsCode).toContain(`const C = new Array(360)`);
  expect(translatedJsCode).toContain(`const S = new Array(360)`);
});
