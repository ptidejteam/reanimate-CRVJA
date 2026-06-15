"use client";
import { useState, useEffect } from "react";
import antlr4 from "antlr4";
import AmosToJavaScriptTranslator from "@/src/transpiler/AmosToJavaScriptTranslator";
import AMOSParser from "@/src/grammar/generated/AMOSParser";
import AMOSLexer from "@/src/grammar/generated/AMOSLexer";
import prettier from "prettier/standalone";
import babelPlugin from "prettier/plugins/babel";
import estreePlugin from "prettier/plugins/estree";
import CollectingErrorListener from "@/src/transpiler/CollectingErrorListener";

export function useAMOSParser(amosCode) {
  const [jsCode, setJsCode] = useState("");
  const [parseErrors, setParseErrors] = useState([]);

  const forceParse = async (codeToParse) => {
    const chars = new antlr4.InputStream(codeToParse);
    const lexer = new AMOSLexer(chars);

    const lexErr = new CollectingErrorListener();
    lexer.removeErrorListeners();
    lexer.addErrorListener(lexErr);

    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new AMOSParser(tokens);

    const parseErr = new CollectingErrorListener();
    parser.removeErrorListeners();
    parser.addErrorListener(parseErr);

    const tree = parser.program();

    // Save errors for UI highlighting (1-based line numbers)
    setParseErrors([...lexErr.errors, ...parseErr.errors]);

    // … your translation, formatting and setJsCode as before …
    const translator = new AmosToJavaScriptTranslator();
    const walker = new antlr4.tree.ParseTreeWalker();
    walker.walk(translator, tree);

    const translatedJsCode = translator.getJavaScript();
    try {
      const formatted = await prettier.format(translatedJsCode, {
        parser: "babel",
        plugins: [babelPlugin, estreePlugin],
      });
      setJsCode(formatted);
      // console.log(formatted);
    } catch {
      setJsCode(translatedJsCode);
    }
  };

  useEffect(() => {
    if (!amosCode) {
      setParseErrors([]);
      return;
    }

    const id = setTimeout(() => {
      forceParse(amosCode);
    }, 250); // debounce 250ms

    return () => clearTimeout(id);
  }, [amosCode]);

  return { jsCode, parseErrors, forceParse };
}
