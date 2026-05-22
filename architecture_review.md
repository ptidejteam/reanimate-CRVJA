# Code Architecture Review: Reanimate-CRVJA

This report evaluates the current architecture of the **Reanimate-CRVJA** Next.js project, deployed on **Vercel** at [https://crvja.reanimate.school/](https://crvja.reanimate.school/). It focuses on assessing the existing directory layout and planning the decomposition of the monolithic `app/page.js` file into a scalable, maintainable structure.

> **⚠️ Deployment Constraint:** This application runs in production on Vercel. Every recommendation in this document is evaluated against the risk of breaking the live deployment. Suggestions are tagged with risk levels and clearly state when a change requires careful migration versus when it is safe.

*(Note: This is a suggestions-only report. No files have been modified.)*

---

## 🤖 AI Agent Execution Protocol

This document is designed to be used as context for an AI coding agent. The refactoring is split into **5 phases**, each self-contained and independently deployable.

### How to use this document

1. **Prompt the agent with:** `"Do Phase 1"`, `"Do Phase 2"`, etc.
2. Each phase lists **exact sub-steps** (1.1, 1.2, …) with source line ranges, target file paths, and what to extract.
3. The agent **MUST** follow these rules for every phase:

### Rules for every phase

1. **Read `app/page.js` first** — line ranges may shift after previous phases. Always locate code by its content/function name, not by hardcoded line numbers.
2. **Create the new file** with the extracted code. Add `"use client";` at the top if the file uses React hooks or browser APIs. Add necessary imports.
3. **Update `app/page.js`** — replace the extracted code with an `import` statement. Do NOT leave dead code behind.
4. **Remove the duplicate `styleButton`** inside `App()` (around line 1439) once `app/constants/styles.js` exists — import it instead.
5. **Preserve all existing comments and JSDoc** in extracted code.
6. **Run `npm run build`** after each sub-step to verify the build passes. If it fails, fix before proceeding.
7. **Do NOT move, rename, or delete any existing files** unless the phase explicitly says so. Only create NEW files and edit `page.js`.
8. **Do NOT touch:** `antlr-4.13.2-complete.jar`, `src/fonts/`, `public/`, `globals.css`, `layout.js`, `AMOSLexer.js`, `AMOSParser.js`, `AMOSListener.js`, or any file in the project root unless explicitly instructed.
9. **Import convention:** Use the `@/` alias (maps to project root via `jsconfig.json`). Example: `import { styleButton } from "@/app/constants/styles";`
10. **After completing ALL sub-steps in a phase**, run `npm run build` one final time and report the result.

---

## Deployment Context

| Detail            | Value                                       |
|-------------------|---------------------------------------------|
| **Framework**     | Next.js 14.2.7 (App Router)                 |
| **Host**          | Vercel                                      |
| **Production URL**| `https://crvja.reanimate.school/`           |
| **Build command** | `next build`                                |
| **Path alias**    | `@/*` → `./*` (via `jsconfig.json`)         |
| **Node runtime**  | Vercel serverless (for API routes)           |

### Key Vercel/Next.js constraints to keep in mind

1. **`public/` is the only static-serve directory.** Files in `src/` are NOT served to the browser at runtime — they are bundled by webpack at build time. However, CSS `url()` references to `src/` files work because Next.js resolves them during the build step.
2. **ANTLR generated files live at the project root** (`AMOSLexer.js`, `AMOSParser.js`, `AMOSListener.js`), not in `grammar/generated/` as previously documented. `page.js` imports them via `@/AMOSLexer` and `@/AMOSParser`. The `grammar/` directory only contains `AMOS.g4`.
3. **`antlr-4.13.2-complete.jar`** (2.1 MB) is used to regenerate the parser from `grammar/AMOS.g4`. It is a development-time tool, **not** used at runtime. It is safe to keep in the repo (and should stay — it's needed for grammar changes). It does NOT affect the Vercel build or bundle size.
4. **Test files** import from `../grammar/generated/AMOSLexer` and `../grammar/generated/AMOSParser` — but this path **does not currently exist**. This suggests tests may be stale or there was a past refactor that moved files to the root without updating tests. This needs investigation before any file moves.
5. **`globals.css`** references fonts via `url('../src/fonts/amiga/...')`. Deleting `src/fonts/` would **break the production build**.

---

## Step 1 — Evaluate the Current Layout (Corrected)

### Actual Project Structure (as of review date)

```text
/ (project root)
├── AMOSLexer.js              ← ANTLR generated (imported by page.js as @/AMOSLexer)
├── AMOSParser.js             ← ANTLR generated (imported by page.js as @/AMOSParser)
├── AMOSListener.js           ← ANTLR generated
├── AMOS.interp               ← ANTLR metadata
├── AMOS.tokens               ← ANTLR metadata
├── AMOSLexer.interp          ← ANTLR metadata
├── AMOSLexer.tokens          ← ANTLR metadata
├── antlr-4.13.2-complete.jar ← Dev tool for grammar regeneration (KEEP)
├── grammar/
│   └── AMOS.g4               ← Source grammar
├── app/
│   ├── page.js               ← ~1912 lines — the monolith
│   ├── layout.js
│   ├── globals.css            ← Loads fonts from ../src/fonts/
│   ├── page.module.css
│   ├── favicon.ico
│   └── api/
│       ├── readBank1/
│       ├── readBank2/
│       └── tutorial/
├── src/
│   ├── fonts/amiga/           ← Referenced by globals.css (DO NOT DELETE)
│   ├── transpiler/
│   │   └── AmosToJavaScriptTranslator.js
│   └── tools/
│       ├── AmosCsStyle.js
│       ├── AmosDecoder.js
│       ├── UI/
│       │   ├── workbench.js   ← WorkbenchShell, WorkbenchWindow, WorkbenchIcon
│       │   └── analogClock.js ← AnalogClock component
│       └── bankReader/
│           └── bankReader.js
├── public/
│   ├── AmosFiles/             ← .abk and .asc example files
│   ├── fonts/amiga/           ← Fonts served to iframe via /fonts/amiga/
│   ├── icons/                 ← Desktop icons (beer.png, sprite.png, etc.)
│   └── extensions/
├── tests/                     ← Jest tests (import from grammar/generated/ — broken path)
├── package.json
├── jsconfig.json
├── jest.config.js
├── next.config.mjs
└── tutorial.md
```

### Issue Analysis

#### ✅ KEEP AS-IS: `antlr-4.13.2-complete.jar`
- **Why:** This JAR is the ANTLR tool used to regenerate the parser from `AMOS.g4`. It is a development dependency, not a runtime artifact. Vercel ignores it during the build. Removing it would make grammar modifications impossible without re-downloading the JAR.
- **Risk of removal:** **HIGH** — breaks developer workflow for grammar changes.

#### ✅ KEEP AS-IS: `src/fonts/`
- **Why:** `app/globals.css` references `url('../src/fonts/amiga/amiga4ever.ttf')`. Next.js resolves this at build time via webpack. Deleting `src/fonts/` would cause a **production build failure**.
- **Note:** There is a **duplicate** at `public/fonts/amiga/` — the iframe uses `public/` fonts via absolute URLs (`/fonts/amiga/amiga4ever.ttf`). Both copies serve different purposes and both are needed.
- **Risk of removal:** **HIGH** — breaks production build.

#### ⚠️ CAREFUL: ANTLR Generated Files at Project Root
- **Current:** `AMOSLexer.js`, `AMOSParser.js`, `AMOSListener.js` + `.interp`/`.tokens` files live at project root.
- **`page.js` imports:** `import AMOSParser from "@/AMOSParser"` and `import AMOSLexer from "@/AMOSLexer"` (root-level via `@/*` alias).
- **Test imports:** `import AMOSLexer from "../grammar/generated/AMOSLexer"` — this path **does not exist**. Tests may be failing silently or haven't been run recently.
- **Recommendation:** Moving these files is possible but requires updating imports in both `page.js` AND all 15 test files. This is a **Phase 3** task (see below) and should be done carefully with a Vercel preview deploy verification.
- **Risk of careless move:** **HIGH** — breaks build and tests.

#### 🔄 RELOCATABLE: UI Components in `src/tools/UI/`
- `workbench.js` and `analogClock.js` are React components, not domain tools.
- Moving them to `app/components/` is architecturally correct, but the current location **works fine** with the `@/` alias.
- **Recommendation:** Move as part of Phase 2 (after `page.js` decomposition). Update the single import in `page.js`.
- **Risk:** **LOW** — only one consumer (`page.js`).

---

## Step 2 — Plan the Decomposition of `page.js`

The current `app/page.js` is **1912 lines** and contains **10 distinct responsibilities**. The decomposition plan below extracts each concern into its own file. This is the **primary refactoring goal**.

### Anatomy of `page.js` — What Lives Where

| Lines (approx.) | Responsibility | Extraction Target |
|---|---|---|
| 16–30 | `styleButton` constant (duplicated at L1439) | `app/constants/styles.js` |
| 32–40 | `CollectingErrorListener` class | `src/transpiler/CollectingErrorListener.js` |
| 42–307 | `CodeEditorWithErrors` component | `app/components/Editor/CodeEditorWithErrors.js` |
| 308–380 | `ExampleTabs` component | `app/components/Editor/ExampleTabs.js` |
| 382–419 | App state declarations + `useEffect` hooks | Stays in `page.js` (orchestrator) |
| 420–501 | `loadBank()` function | `src/tools/bankReader/loadBank.js` |
| 502–515 | `downloadASCFile()` function | `src/tools/fileUtils.js` |
| 516–519 | `clearBank()` function | Part of `useBankCreator` hook |
| 534–570 | `parseAmosCode()` function | `app/hooks/useAMOSParser.js` |
| 582–844 | Iframe injection `useEffect` (~260 lines) | `app/components/Runner/AmosRunner.js` |
| 846–925 | `generateAmosBankFile()` function | `src/tools/bankWriter/generateAmosBankFile.js` |
| 931–1408 | `BankEditor` component (nested inside App!) | `app/components/BankEditor/BankEditor.js` |
| 1409–1420 | Debounced parse `useEffect` | Part of `useAMOSParser` hook |
| 1422–1453 | Window visibility state + duplicate `styleButton` | Stays in `page.js` / use shared constant |
| 1455–1906 | JSX return (render tree) | Stays in `page.js` (now much shorter) |

### Detailed Extraction Plan

#### 1. `app/constants/styles.js` — Shared Style Constants
- **What:** The `styleButton` object is defined **twice** (line 16 and line 1439). Extract once.
- **Complexity:** **Trivial**
- **Lines saved:** ~30

#### 2. `src/transpiler/CollectingErrorListener.js` — ANTLR Error Collector
- **What:** A pure class extending `antlr4.error.ErrorListener`. No React dependencies.
- **Current location:** Lines 32–40 of `page.js`.
- **Interface:** `new CollectingErrorListener()` → `.errors` array populated by ANTLR.
- **Dependencies:** `antlr4` (npm package, already installed).
- **Complexity:** **Easy** — pure class, zero side effects.
- **Lines saved:** ~10

#### 3. `app/components/Editor/CodeEditorWithErrors.js` — Code Editor
- **What:** A self-contained React component that renders a `<textarea>` with an overlay for error highlighting and tooltips.
- **Current location:** Lines 42–307 of `page.js`. Already written as a standalone function component outside `App`.
- **Props interface:**
  ```js
  { value, onChange, errors, style, className, fontFamily, fontSize, lineHeight, tabColumns }
  ```
- **Internal state:** `tip` (tooltip position), scroll sync via `useLayoutEffect`.
- **Dependencies:** React only. Contains its own `<style>` tag for `.err-ch` and `.err-line` classes.
- **Complexity:** **Easy** — already decoupled, just cut-and-paste with an export.
- **Lines saved:** ~265

#### 4. `app/components/Editor/ExampleTabs.js` — Example Selector
- **What:** Renders a paginated row of preset AMOS program buttons.
- **Current location:** Lines 308–380. Already a standalone function component.
- **Props interface:**
  ```js
  { tabs: Array<Array<{ label: string, onClick: () => void }>>, onSelect?: callback }
  ```
- **Dependencies:** React `useState`. Also uses the `styleButton` constant (import from `app/constants/styles.js`).
- **Complexity:** **Easy** — pure UI component.
- **Lines saved:** ~70

#### 5. `app/hooks/useAMOSParser.js` — ANTLR Parsing Hook
- **What:** Encapsulates the entire ANTLR parsing + translation + Prettier formatting pipeline, plus the 250ms debounce.
- **Current location:** `parseAmosCode()` at lines 534–570, debounce `useEffect` at lines 1409–1420.
- **Proposed interface:**
  ```js
  function useAMOSParser(amosCode) {
    // Returns:
    return { jsCode, parseErrors, forceParse };
  }
  ```
- **Dependencies:** `antlr4`, `AMOSParser`, `AMOSLexer`, `AmosToJavaScriptTranslator`, `prettier`, `CollectingErrorListener`.
- **Complexity:** **Medium** — must carefully move the debounce timer and ensure `forceParse` can be called imperatively for the "Run code" button.
- **Lines saved:** ~50

#### 6. `app/hooks/useBankCreator.js` — Bank State Hook
- **What:** Manages the `bankCreator` state (sprites + palette), syncs with `localStorage`, provides `clearBank`.
- **Current location:** State at lines 397–400, localStorage effects at lines 406–418, `clearBank` at lines 516–519.
- **Proposed interface:**
  ```js
  function useBankCreator() {
    return { bankCreator, setBankCreator, clearBank };
  }
  ```
- **Dependencies:** React `useState` + `useEffect`. No external libraries.
- **Complexity:** **Easy** — straightforward state + localStorage extraction.
- **Lines saved:** ~25

#### 7. `src/tools/bankReader/loadBank.js` — Binary Bank Loader
- **What:** Reads an `.abk` file from a `<input type="file">`, parses the Amiga sprite bank binary format (headers, planar graphic data, 16-bit palette), and returns a `{ sprites, palette }` object.
- **Current location:** Lines 420–501. Currently calls `setBankCreator` directly — must be refactored to return data instead.
- **Proposed interface:**
  ```js
  // Pure function — no React dependency
  export async function parseBankFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => { /* ... */ resolve({ sprites, palette }); };
      reader.readAsArrayBuffer(file);
    });
  }
  ```
- **Dependencies:** None (pure binary parsing).
- **Complexity:** **Easy** — extract and promisify.
- **Lines saved:** ~80

#### 8. `src/tools/bankWriter/generateAmosBankFile.js` — Binary Bank Generator
- **What:** Takes a `{ sprites, palette }` object, encodes it to the Amiga `.abk` binary format, and triggers a browser download.
- **Current location:** Lines 846–925.
- **Proposed interface:**
  ```js
  export function generateAmosBankFile(bankCreator, filename = "AmosBank_test4.abk") { ... }
  ```
- **Dependencies:** None (pure binary encoding + DOM download).
- **Complexity:** **Easy** — pure function extraction.
- **Lines saved:** ~80

#### 9. `app/components/BankEditor/BankEditor.js` — Sprite/Palette Editor
- **What:** A full-featured pixel editor with palette management, sprite list, add/duplicate/delete, and click-to-paint on a CSS grid canvas.
- **Current location:** Lines 931–1408. **Defined as a nested function inside `App()`** — this is the single worst architectural issue in the file. It re-creates the component on every parent render.
- **Props interface:**
  ```js
  { bankCreator, setBankCreator }
  ```
- **Internal state:** `palette`, `sprites`, `spriteSelected`, `showColorPicker`, `isMouseDown`, `colorPickerPosition`, `selectedColorIndex`, `currentColorIndex`, `spriteWidth`, `spriteHeight`.
- **Dependencies:** React, `@uiw/react-color` (`Sketch`), calls `generateAmosBankFile` and `loadBank` (will import from extracted modules).
- **Complexity:** **Hard** — 477 lines with 10 local state variables, pixel manipulation logic, and closure over parent's `bankCreator`/`setBankCreator`. The helper `renderSpritePixels()` should be extracted as a pure utility.
- **Sub-extractions inside BankEditor:**
  - `renderSpritePixels()` → `src/tools/spriteRenderer.js` (pure function, no React)
  - `handlePixelPaint()` / `handlePixelClick()` → could be consolidated (they are ~90% duplicate code)
- **Lines saved:** ~477

#### 10. `app/components/Runner/AmosRunner.js` — Iframe Sandbox
- **What:** Creates an `<iframe>` with `srcdoc`, injects the transpiled JS code, handles `postMessage`-based communication for bank forwarding, size reporting, and console piping.
- **Current location:** Lines 582–844 (a single `useEffect`).
- **Proposed interface:**
  ```jsx
  <AmosRunner jsCode={jsCode} runNonce={runNonce} bankFiles={bankFiles} />
  ```
- **Internal behavior:** Manages iframe lifecycle, `ResizeObserver`, `MutationObserver`, and `postMessage` listeners. Cleans up on unmount.
- **Dependencies:** React `useEffect` + `useRef`. No external libraries.
- **Complexity:** **Medium–Hard** — the most volatile piece. The iframe `srcdoc` template contains ~120 lines of inline JS. Must preserve the `token`-based message protocol exactly.
- **Lines saved:** ~260

### Post-Decomposition: What Remains in `page.js`

After all extractions, `page.js` becomes a thin orchestrator (~200–250 lines):

```js
"use client";
import React, { useState, useRef } from "react";
import { useAMOSParser } from "@/app/hooks/useAMOSParser";
import { useBankCreator } from "@/app/hooks/useBankCreator";
import CodeEditorWithErrors from "@/app/components/Editor/CodeEditorWithErrors";
import ExampleTabs from "@/app/components/Editor/ExampleTabs";
import AmosRunner from "@/app/components/Runner/AmosRunner";
import BankEditor from "@/app/components/BankEditor/BankEditor";
import AMOSDecoder from "@/src/tools/AmosDecoder";
import AnalogClock from "@/src/tools/UI/analogClock";
import { WorkbenchIcon, WorkbenchShell, WorkbenchWindow } from "@/src/tools/UI/workbench";
import { styleButton } from "@/app/constants/styles";
// ... etc.

function App() {
  // Window visibility state
  const [showCode, setShowCode] = useState(false);
  // ... other show* states

  // Hooks
  const { bankCreator, setBankCreator, clearBank } = useBankCreator();
  const [AmosCode, setAmosCode] = useState("");
  const { jsCode, parseErrors, forceParse } = useAMOSParser(AmosCode);
  const [bankFiles, setBankFiles] = useState([]);
  const [runNonce, setRunNonce] = useState(0);

  // JSX: WorkbenchShell > Icons > Windows (each delegating to extracted components)
  return (
    <WorkbenchShell>
      {/* Icons */}
      {/* Windows using extracted components */}
    </WorkbenchShell>
  );
}
```

---

## Step 3 — Target Directory Structure (Deployment-Safe)

This structure preserves all files critical to the Vercel deployment. Files that are **not moved** are explicitly noted.

```text
/ (project root)
├── AMOSLexer.js              ← UNCHANGED (root import used by page.js)
├── AMOSParser.js             ← UNCHANGED
├── AMOSListener.js           ← UNCHANGED
├── AMOS.interp               ← UNCHANGED
├── AMOS.tokens               ← UNCHANGED
├── AMOSLexer.interp          ← UNCHANGED
├── AMOSLexer.tokens          ← UNCHANGED
├── antlr-4.13.2-complete.jar ← UNCHANGED (dev tool)
│
├── grammar/
│   └── AMOS.g4               ← UNCHANGED
│
├── app/
│   ├── page.js               ← REFACTORED: thin orchestrator (~200–250 lines)
│   ├── layout.js             ← UNCHANGED
│   ├── globals.css            ← UNCHANGED (keeps src/fonts reference)
│   ├── page.module.css        ← UNCHANGED
│   ├── favicon.ico            ← UNCHANGED
│   ├── constants/
│   │   └── styles.js          ← NEW: shared styleButton + other style constants
│   ├── hooks/
│   │   ├── useAMOSParser.js   ← NEW: ANTLR parsing + debounce + formatting
│   │   └── useBankCreator.js  ← NEW: bank state + localStorage sync
│   ├── components/
│   │   ├── Editor/
│   │   │   ├── CodeEditorWithErrors.js  ← NEW: extracted from page.js
│   │   │   └── ExampleTabs.js           ← NEW: extracted from page.js
│   │   ├── Runner/
│   │   │   └── AmosRunner.js            ← NEW: iframe sandbox component
│   │   ├── BankEditor/
│   │   │   └── BankEditor.js            ← NEW: sprite/palette editor
│   │   └── BankManager/
│   │       └── BankSlotManager.js       ← NEW: 6 bank file inputs
│   └── api/                   ← UNCHANGED
│       ├── readBank1/
│       ├── readBank2/
│       └── tutorial/
│
├── src/
│   ├── fonts/amiga/           ← UNCHANGED (required by globals.css)
│   ├── transpiler/
│   │   ├── AmosToJavaScriptTranslator.js  ← UNCHANGED
│   │   └── CollectingErrorListener.js     ← NEW: extracted from page.js
│   └── tools/
│       ├── AmosCsStyle.js     ← UNCHANGED
│       ├── AmosDecoder.js     ← UNCHANGED
│       ├── UI/
│       │   ├── workbench.js   ← UNCHANGED (move to app/components later)
│       │   └── analogClock.js ← UNCHANGED (move to app/components later)
│       ├── bankReader/
│       │   ├── bankReader.js  ← UNCHANGED (existing)
│       │   └── loadBank.js    ← NEW: extracted from page.js
│       ├── bankWriter/
│       │   └── generateAmosBankFile.js  ← NEW: extracted from page.js
│       ├── spriteRenderer.js  ← NEW: renderSpritePixels pure function
│       └── fileUtils.js       ← NEW: downloadASCFile utility
│
├── public/                    ← UNCHANGED entirely
│   ├── AmosFiles/
│   ├── fonts/amiga/
│   ├── icons/
│   └── extensions/
│
├── tests/                     ← UNCHANGED (fix imports separately)
├── package.json               ← UNCHANGED
├── jsconfig.json              ← UNCHANGED
└── tutorial.md                ← UNCHANGED
```

---

## Step 4 — Phased Execution Plan (AI Agent Instructions)

> **🤖 Agent:** When the user says **"Do Phase N"**, execute ALL sub-steps in that phase sequentially. After each sub-step, run `npm run build` to verify. If the build fails, fix it before moving to the next sub-step. Report what you did and the build result at the end.

---

### Phase 1: Pure Extractions — Zero Risk ✅

These changes extract code from `page.js` into new files and update imports. No existing files are moved or renamed.

#### Step 1.1 — Extract `styleButton` constant
- **Create** `app/constants/styles.js`
- **Copy** the `styleButton` object (defined around line 16 of `page.js`, outside `App`).
- **Export** it as a named export: `export const styleButton = { ... };`
- **In `page.js`:** Remove the top-level `styleButton` definition. Remove the duplicate definition inside `App()` (around line 1439). Add `import { styleButton } from "@/app/constants/styles";` at the top.
- **Check:** `ExampleTabs` also uses `styleButton` — it references the module-scope variable. After extraction, `ExampleTabs` (still in `page.js` at this point) must be able to see the import. This works because the import is at module scope.
- Run `npm run build`.

#### Step 1.2 — Extract `CollectingErrorListener`
- **Create** `src/transpiler/CollectingErrorListener.js`
- **Copy** the `CollectingErrorListener` class (around lines 32–40 of `page.js`).
- Add `import antlr4 from "antlr4";` at the top. Export the class as default.
- **In `page.js`:** Remove the class. Add `import CollectingErrorListener from "@/src/transpiler/CollectingErrorListener";`
- Run `npm run build`.

#### Step 1.3 — Extract `CodeEditorWithErrors`
- **Create** `app/components/Editor/CodeEditorWithErrors.js`
- Add `"use client";` at the top (it uses React hooks).
- **Copy** the entire `CodeEditorWithErrors` function component (around lines 42–307). Include the `import React` it needs.
- Export as default.
- **In `page.js`:** Remove the function. Add `import CodeEditorWithErrors from "@/app/components/Editor/CodeEditorWithErrors";`
- Run `npm run build`.

#### Step 1.4 — Extract `ExampleTabs`
- **Create** `app/components/Editor/ExampleTabs.js`
- Add `"use client";` at the top.
- **Copy** the `ExampleTabs` function component (around lines 308–380).
- Import `{ useState }` from React and `{ styleButton }` from `@/app/constants/styles`.
- Export as default.
- **In `page.js`:** Remove the function. Add `import ExampleTabs from "@/app/components/Editor/ExampleTabs";`
- Run `npm run build`.

#### Step 1.5 — Extract `downloadASCFile`
- **Create** `src/tools/fileUtils.js`
- **Copy** the `downloadASCFile` function (around lines 502–515 of `page.js`).
- Export as a named export.
- **In `page.js`:** Remove the function. Add `import { downloadASCFile } from "@/src/tools/fileUtils";`
- Run `npm run build`.

**✅ Phase 1 complete.** `page.js` should be ~390 lines shorter. All functionality identical.

---

### Phase 2: Domain Logic Extraction — Low Risk ⚠️

These extract pure (non-React) functions from `page.js` into utility modules.

#### Step 2.1 — Extract `loadBank` (promisified)
- **Create** `src/tools/bankReader/loadBank.js`
- **Copy** the `loadBank` function from `page.js` (around lines 420–501).
- **Refactor** it to be a pure async function that takes a `File` object and returns `{ sprites, palette }` via a Promise (instead of calling `setBankCreator` directly). Remove the DOM `document.getElementById` lookup — the caller should pass the file.
- Export as: `export async function parseBankFile(file) { ... }`
- **In `page.js`:** Remove `loadBank`. Import `parseBankFile`. Update the call site in `BankEditor`'s file input `onChange` to: `const result = await parseBankFile(file); setBankCreator({...bankCreator, ...result});`
- Run `npm run build`.

#### Step 2.2 — Extract `generateAmosBankFile`
- **Create** `src/tools/bankWriter/generateAmosBankFile.js`
- **Copy** the `generateAmosBankFile` function (around lines 846–925). Include the inner `rgbTo16Bit` helper.
- Export as: `export function generateAmosBankFile(bankCreator, filename) { ... }`
- **In `page.js`:** Remove the function. Add the import. Update the call site in `BankEditor`.
- Run `npm run build`.

#### Step 2.3 — Extract `renderSpritePixels`
- **Create** `src/tools/spriteRenderer.js`
- **Copy** the `renderSpritePixels` function from inside `BankEditor` (around lines 932–963). It is a pure function (no React).
- Export as: `export function renderSpritePixels(planarGraphicData, width, height, depth, palette) { ... }`
- **In `page.js`:** Remove from `BankEditor`. Import it inside `BankEditor`'s scope. (It will move again in Phase 4 when `BankEditor` is fully extracted.)
- Run `npm run build`.

**✅ Phase 2 complete.** ~185 more lines freed. Binary logic fully separated from React.

---

### Phase 3: Hook Extraction — Medium Risk ⚠️⚠️

These extract stateful logic into custom React hooks.

#### Step 3.1 — Extract `useBankCreator` hook
- **Create** `app/hooks/useBankCreator.js`
- Add `"use client";` at the top.
- **Move** the following from `App()` in `page.js`:
  - `const [bankCreator, setBankCreator] = useState(...)` (around line 397)
  - The `useEffect` that loads from `localStorage` on mount (around lines 406–411)
  - The `useEffect` that saves to `localStorage` on change (around lines 415–418)
  - The `clearBank` function (around lines 516–519)
- **Return** `{ bankCreator, setBankCreator, clearBank }` from the hook.
- **In `page.js`:** Replace extracted code with `const { bankCreator, setBankCreator, clearBank } = useBankCreator();`
- Run `npm run build`.

#### Step 3.2 — Extract `useAMOSParser` hook
- **Create** `app/hooks/useAMOSParser.js`
- Add `"use client";` at the top.
- **Move** the following from `App()` in `page.js`:
  - `const [jsCode, setJsCode] = useState("")`
  - `const [parseErrors, setParseErrors] = useState([])`
  - The `parseAmosCode` async function (around lines 534–570)
  - The debounced `useEffect` (around lines 1409–1420)
- **Import** `antlr4`, `AMOSParser`, `AMOSLexer`, `AmosToJavaScriptTranslator`, `prettier`, `babelPlugin`, `estreePlugin`, `CollectingErrorListener`.
- **Interface:** `function useAMOSParser(amosCode)` → returns `{ jsCode, parseErrors, forceParse }` where `forceParse` is a wrapper that calls `parseAmosCode` directly (for the "Run code" button).
- **In `page.js`:** Replace extracted code with `const { jsCode, parseErrors, forceParse } = useAMOSParser(AmosCode);`. Remove the now-unused imports (`antlr4`, `AMOSParser`, `AMOSLexer`, `prettier`, etc.) from `page.js`.
- **Update the "Run code" button** `onClick` to call `forceParse(AmosCode)` then `onRunClick()`.
- Run `npm run build`.

**✅ Phase 3 complete.** `page.js` no longer imports ANTLR or Prettier directly.

---

### Phase 4: Complex Component Extraction — Higher Risk ⚠️⚠️⚠️

> **🤖 Agent:** These steps extract large, stateful components. Read the current `page.js` carefully before each step — line numbers will have shifted significantly by this point.

#### Step 4.1 — Extract `BankEditor`
- **Create** `app/components/BankEditor/BankEditor.js`
- Add `"use client";` at the top.
- **Move** the entire `BankEditor` function (currently a nested function inside `App()`). It starts with `function BankEditor({ bankCreator, setBankCreator })` and ends before the debounced parse `useEffect`.
- **Add imports** for: React, `useState`, `useEffect`, `{ Sketch }` from `@uiw/react-color`, `{ generateAmosBankFile }` from `@/src/tools/bankWriter/generateAmosBankFile`, `{ parseBankFile }` from `@/src/tools/bankReader/loadBank`, `{ renderSpritePixels }` from `@/src/tools/spriteRenderer`.
- **Props interface stays:** `{ bankCreator, setBankCreator }`
- **Refactor the `loadBank(1)` call** inside BankEditor to use `parseBankFile` (already done in Phase 2, but verify).
- Export as default.
- **In `page.js`:** Remove the nested `BankEditor` function entirely. Add `import BankEditor from "@/app/components/BankEditor/BankEditor";`. The JSX `<BankEditor bankCreator={bankCreator} setBankCreator={setBankCreator} />` stays unchanged.
- Run `npm run build`.

#### Step 4.2 — Extract iframe `useEffect` into `<AmosRunner>`
- **Create** `app/components/Runner/AmosRunner.js`
- Add `"use client";` at the top.
- **Create a component** `AmosRunner` with props: `{ jsCode, runNonce, bankFiles }`
- **Move** the entire `useEffect` that creates the iframe (find it by the `"game-container"` reference and the `iframe.srcdoc` assignment). Also move the `bankFilesRef` ref.
- The component renders `<div id="game-container" />` and owns the `useEffect` that populates it.
- **Important:** The `forwardBanks` function inside the `useEffect` reads from `bankFilesRef.current` — make sure the ref is kept in sync via a `useEffect` in `AmosRunner`.
- Export as default.
- **In `page.js`:** Remove the iframe `useEffect`, the `bankFilesRef`, and the `<div id="game-container">` from the JSX. Replace with `<AmosRunner jsCode={jsCode} runNonce={runNonce} bankFiles={bankFiles} />`.
- Run `npm run build`.

#### Step 4.3 — Extract bank file inputs into `<BankSlotManager>`
- **Create** `app/components/BankManager/BankSlotManager.js`
- Add `"use client";` at the top.
- **Move** the JSX block that renders `Array.from({ length: numBanks }, ...)` with the 6 `<input type="file">` elements and the bank file list display.
- **Props:** `{ numBanks, bankFiles, onFileChange }`
- Export as default.
- **In `page.js`:** Replace the bank inputs JSX with `<BankSlotManager numBanks={numBanks} bankFiles={bankFiles} onFileChange={handleFileChange} />`.
- Run `npm run build`.

**✅ Phase 4 complete.** `page.js` should now be ~200–250 lines — a thin orchestrator.

---

### Phase 5: Deferred Cleanup — Do Later, Separately

These are **not part of the `page.js` decomposition**. Do them only after Phases 1–4 are stable in production.

| Step | Task | Risk | Instructions |
|------|------|------|------|
| 5.1 | Move `src/tools/UI/workbench.js` → `app/components/Workbench/workbench.js` | Low | Update the single import in `page.js`. |
| 5.2 | Move `src/tools/UI/analogClock.js` → `app/components/Desktop/analogClock.js` | Low | Update the single import in `page.js`. |
| 5.3 | Move ANTLR files from root → `src/transpiler/generated/` | Medium | Update imports in `useAMOSParser.js` + all 15 test files. Verify `@/` alias works. |
| 5.4 | Fix test imports (`grammar/generated/` → correct path) | Medium | All test files reference a non-existent path. |
| 5.5 | Add ANTLR generation script to `package.json` | Low | `"generate-parser": "java -jar antlr-4.13.2-complete.jar -Dlanguage=JavaScript -visitor grammar/AMOS.g4 -o src/transpiler/generated"` |
| 5.6 | Consolidate duplicate font directories | Low | Verify which build step uses `src/fonts/` vs `public/fonts/`. |

---

## Step 5 — Pre-Existing Issues Found During Review

| Issue | Severity | Details |
|-------|----------|---------|
| **Tests import from non-existent path** | 🔴 High | All 15 test files import from `../grammar/generated/AMOSLexer` — but `grammar/generated/` does not exist. The generated files are at the project root. Tests may be broken. |
| **`BankEditor` defined inside `App()`** | 🟡 Medium | The entire `BankEditor` component (~477 lines) is a nested function inside `App`. This means it is re-created on every parent render, losing all internal state and causing unnecessary re-renders. |
| **Duplicate `styleButton` definition** | 🟡 Medium | Defined at line 16 (module scope) and again at line 1439 (inside `App`). The inner one shadows the outer one. |
| **`handlePixelClick` and `handlePixelPaint` are ~90% duplicate** | 🟡 Medium | Both perform the same planar data bit manipulation. Should be a single function. |
| **No ANTLR build script** | 🟢 Low | There is no npm script to regenerate the parser. The JAR exists but the command is undocumented. |
| **`fs` in dependencies** | 🟢 Low | `package.json` lists `"fs": "^0.0.1-security"` — this is a no-op shim. Harmless but unnecessary. |
