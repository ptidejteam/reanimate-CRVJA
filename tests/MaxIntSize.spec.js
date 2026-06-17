import { translateAmos } from "./helpers/translate";

test("max_int_size", () => {
  const amosBasicCode = `
   XW=2147483648
  `;

  try {
    const [lexErrs, parseErrs, translatedJS] = translateAmos(amosBasicCode);
    expect(lexErrs.errors).toEqual([]);
    expect(parseErrs.errors).toEqual([]);
  } catch (error) {
    // Verify that the error message is as expected
    expect(error.message).toBe(`ERROR: Amos code line 2: Value for variable "XW" exceeds the allowed limit of 2,147,483,647.`);
  }
});
