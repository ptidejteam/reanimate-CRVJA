# CRVJA vs. AMOS Pro Syntax Inconsistencies

This document lists known syntax and behavior inconsistencies between the CRVJA transpiler and the official AMOS Pro specification for Amiga.

---

## 1. Type Enforcement in `Text` Command
* **Real AMOS Pro**: The `Text` command requires a string expression for its third parameter: `Text X, Y, String$`. Passing a numeric variable (e.g., `Text 10, 20, A`) causes a `Type Mismatch` error. In real AMOS, you must convert the number to a string using the `Str$` function:
  ```amos
  Text 10, 20, Str$(A)
  ```
* **CRVJA**: The grammar's `text` rule accepts either `STRING` or `IDENTIFIER` (which includes both string and numeric variables). The transpiler outputs Javascript that maps directly to HTML element `.innerText`, relying on JavaScript's implicit type coercion to display the number without error.

---

## 2. Variable String Assignments
* **Real AMOS Pro**: You can assign any string literal to a string variable:
  ```amos
  A$ = "Twins"
  ```
* **CRVJA**: The `variable_starter` rule only allows assigning `expression1` (which does not match the `STRING` token) or empty double quotes `""`. Consequently, assigning a non-empty string literal to a variable is currently syntactically invalid in the parser.

---

## 3. Procedure Call Parameter Types
* **Real AMOS Pro**: You can pass string literals directly as arguments in procedure calls:
  ```amos
  TWINS["Twins"]
  ```
* **CRVJA**: The `procedure_call` rule expects arguments to be of type `expression1` (which does not match the `STRING` token). Only numbers and identifiers (variable names) can be passed inside the bracket parameters.

---

## 4. Lack of String Conversion Functions
* **Real AMOS Pro**: Functions like `Str$(A)` (convert integer to string), `Val(A$)` (convert string to number), or string concatenation `A$ + B$` are fully supported.
* **CRVJA**: These built-in AMOS functions are not implemented in the transpiler or grammar.
