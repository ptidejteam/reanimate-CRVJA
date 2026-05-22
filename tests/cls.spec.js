import antlr4 from "antlr4";
import AmosToJavaScriptTranslator from "@/src/transpiler/AmosToJavaScriptTranslator";
import AMOSParser from "@/grammar/generated/AMOSParser";
import AMOSLexer from "@/grammar/generated/AMOSLexer";

test("cls translation", () => {
    const amosBasicCode = `
        Cls
    `;

    const chars = new antlr4.InputStream(amosBasicCode);
    const lexer = new AMOSLexer(chars);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new AMOSParser(tokens);

    const tree = parser.program();

    const translator = new AmosToJavaScriptTranslator();
    const walker = new antlr4.tree.ParseTreeWalker();
    walker.walk(translator, tree);
    const translatedJsCode = translator.getJavaScript();

    // Check if the output contains the screen clearing commands
    expect(translatedJsCode).toContain("const amosScreen = document.getElementById('amos-screen');");
    expect(translatedJsCode).toContain("amosScreen.innerHTML = '';");
});

test("cls with color translation", () => {
    const amosBasicCode = `
        Cls 2
    `;

    const chars = new antlr4.InputStream(amosBasicCode);
    const lexer = new AMOSLexer(chars);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new AMOSParser(tokens);
    const tree = parser.program();

    const translator = new AmosToJavaScriptTranslator();
    const walker = new antlr4.tree.ParseTreeWalker();
    walker.walk(translator, tree);
    const translatedJsCode = translator.getJavaScript();

    // Check if the output contains the screen clearing commands
    expect(translatedJsCode).toContain("const amosScreen = document.getElementById('amos-screen');");
    expect(translatedJsCode).toContain("amosScreen.innerHTML = '';");
    
    // Check if it sets the background color using the colorMapping dictionary
    expect(translatedJsCode).toContain("amosScreen.style.backgroundColor = colorMapping[2];");
});