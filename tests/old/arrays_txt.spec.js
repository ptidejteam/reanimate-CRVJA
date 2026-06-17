import { translateAmos } from "./helpers/translate";
import fs from "fs";

test("arrays_txt", () => {
  const amosBasicCode = `
Dim map(30, 30)
Read map(x,y)
  `;
  const translatedJsCode = translateAmos(amosBasicCode);
  console.log("TRANSLATED_CODE:\n" + translatedJsCode);
});
