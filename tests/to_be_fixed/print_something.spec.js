import { translateAmos } from "../helpers/translate";

test("print_something", () => {
  const amosBasicCode = `Print 500/Timer;" FPS"`;

  const [lexErrs, parseErrs, normalizedJS] = translateAmos(amosBasicCode);
  expect(lexErrs.errors).toEqual([]);
  expect(parseErrs.errors).toEqual([]);
  
  

  // Print item 0 (expression 500/Timer)
  expect(normalizedJS).toContain("const finder_printDiv0 = document.getElementById('printDiv0' + '500/Timer');");
  expect(normalizedJS).toContain("const printDiv0 = document.createElement('div');");
  expect(normalizedJS).toContain("printDiv0.innerText = 500/Timer;");
  expect(normalizedJS).toContain("printDiv0.style.color = Ink;");
  expect(normalizedJS).toContain("printDiv0.style.zIndex = \"999\";");
  expect(normalizedJS).toContain("printDiv0.id = 'printDiv0' + '500/Timer';");

  // Print item 1 (string literal " FPS")
  expect(normalizedJS).toContain("const finder_printDiv1 = document.getElementById('printDiv1' + '\" FPS\"');");
  expect(normalizedJS).toContain("const printDiv1 = document.createElement('div');");
  expect(normalizedJS).toContain("printDiv1.innerText = \" FPS\";");
  expect(normalizedJS).toContain("printDiv1.style.color = Ink;");
  expect(normalizedJS).toContain("printDiv1.style.zIndex = \"999\";");
  expect(normalizedJS).toContain("printDiv1.id = 'printDiv1' + '\" FPS\"';");
});
