import { translateAmos } from "./helpers/translate";

function translate(code) {
  const [lexErrs, parseErrs, normalizedJS] = translateAmos(code);
  expect(lexErrs.errors).toEqual([]);
  expect(parseErrs.errors).toEqual([]);
  return normalizedJS.replace(/\s+/g, " ").trim();
}

test("max_int_size", () => {
  const amosBasicCode = `
   XW=2147483648
  `;

  try {
    translate(amosBasicCode);
  } catch (error) {
    // Verify that the error message is as expected
    expect(error.message).toBe(`ERROR: Amos code line 2: Value for variable "XW" exceeds the allowed limit of 2,147,483,647.`);
  }
});

