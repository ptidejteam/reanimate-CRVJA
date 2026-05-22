# Testing in CRVJA

This document details the testing architecture, validation patterns, and writing guidelines for the CRVJA transpiler test suite.

> [!WARNING]
> **Deprecation Notice & Test Suite Status**: 
> Many of the legacy tests in this suite are currently out-of-date or deprecated due to recent modifications to the compiler structure (e.g., changes in loop structure, array bound conversions). Consequently, several tests will fail when running the full test suite. 
> 
> Currently, only a subset of tests are fully updated (such as `tests/cls.spec.js`). Refactoring the remaining legacy tests to align with the current transpiler output is planned for a future task.

---

## 1. Overview of the Testing Strategy

To ensure correctness and prevent regressions, CRVJA uses unit tests to assert that AMOS Pro statements compile into correct, functional JavaScript blocks.

In compiler development, tests are critical. Even small changes in the grammar or transpiler hooks can have ripple effects (regressions) that break translations of other unrelated statements.

### The Parsing & Compilation Testing Pipeline
```
  [Mock AMOS Code] -> [InputStream] -> [Lexer] -> [TokenStream] -> [Parser] -> [AST Tree]
                                                                                   │
                                                                           [ParseTreeWalker]
                                                                                   │
                                                                           [Listener Traversal]
                                                                                   │
   [Jest Assertions] <----------------- [Assert JS Output] <--------- [Translated JS Code]
```

---

## 2. Test Environment Configuration

* **Test Framework**: Jest
* **Environment**: Node/jsdom, configured in [jest.config.js](file:///Users/viniciusmioto/Projects/reanimate-CRVJA/jest.config.js).
* **Test Location**: All test files are located in the [tests/](file:///Users/viniciusmioto/Projects/reanimate-CRVJA/tests) directory and follow the naming convention `*.spec.js`.

---

## 3. Template: How to Write a New Test

When implementing a new AMOS command (e.g., `Cls`), you should write a matching unit test to verify its compilation. Here is the standard template for writing a test:

```javascript
import antlr4 from "antlr4";
import AmosToJavaScriptTranslator from "@/src/transpiler/AmosToJavaScriptTranslator";
import AMOSParser from "@/grammar/generated/AMOSParser";
import AMOSLexer from "@/grammar/generated/AMOSLexer";

test("cls translation", () => {
  // 1. Mock AMOS Code
  const amosBasicCode = `
        Cls
    `;

  // 2. Setup ANTLR parsing pipeline
  const chars = new antlr4.InputStream(amosBasicCode);
  const lexer = new AMOSLexer(chars);
  const tokens = new antlr4.CommonTokenStream(lexer);
  const parser = new AMOSParser(tokens);
  const tree = parser.program();

  // 3. Translate AST into JS code
  const translator = new AmosToJavaScriptTranslator();
  const walker = new antlr4.tree.ParseTreeWalker();
  walker.walk(translator, tree);
  const translatedJsCode = translator.getJavaScript();

  // 4. Run Assertions (using normalized whitespace)
  const normalizedTranslated = translatedJsCode.replace(/\s+/g, " ").trim();
  expect(normalizedTranslated).toContain("const amosScreen = document.getElementById('amos-screen');");
  expect(normalizedTranslated).toContain("if (amosScreen) { amosScreen.innerHTML = ''; }");
});
```

---

## 4. Best Practices: Handling Formatting & Whitespace Sensitivity

Direct string comparisons (e.g., matching indentation or carriage returns exactly) are fragile. If you adjust block formatting in the compiler, minor spacing modifications will break tests.

To write resilient tests, use **whitespace normalization** to collapse multiple spaces, tabs, and line breaks into single spaces before comparing strings:

```javascript
// Normalize spaces and linebreaks for comparison
const normalizedTranslated = translatedJsCode.replace(/\s+/g, " ").trim();
const normalizedExpected = "const printDiv = document.createElement('div');".replace(/\s+/g, " ").trim();

expect(normalizedTranslated).toContain(normalizedExpected);
```

---

## 5. Critical Troubleshooting: The Walker Mismatch Bug

During the project's development, a subtle issue was uncovered where AST walking would succeed in the React client, but silently fail during Jest tests (not triggering any translator hooks).

### Root Cause
Because of legacy file duplicates, the transpiler files were importing `AMOSListener` and `AMOSParser` from different locations:
* The transpiler (`AmosToJavaScriptTranslator`) imported `AMOSListener` from the root directory `./` (or `@/`).
* The test suites imported `AMOSParser` and `AMOSLexer` from `/grammar/generated/`.

When Node's module loader resolves these imports, they are instantiated as two separate class prototypes in memory. Consequently, inside the ANTLR runtime, the `ParseTreeWalker` checks if the listener extends the expected listener type:
```javascript
// Internal ANTLR4 walk check
if (listener instanceof AMOSListener) { ... }
```
Because the prototypes came from separate files, the check returned `false`, and the walker silently skipped every listener rule.

### Solution
1. **Unify all imports**: Update all compiler and test imports to point strictly to the `/grammar/generated/` folder.
2. **Remove duplicates**: Clean up and delete any duplicate ANTLR output files in the root folder, ensuring only the unified `/grammar/generated/` files exist.

---

## 6. Running the Test Suite

You can run test commands directly from the repository root:

* **Run all tests**:
  ```bash
  npx jest
  ```
* **Run a specific test suite**:
  ```bash
  npx jest tests/cls.spec.js
  ```
* **Run tests in watch mode** (automatically reruns when code files are modified):
  ```bash
  npx jest --watch
  ```
