import antlr4 from "antlr4";
import AmosToJavaScriptTranslator from "@/src/transpiler/AmosToJavaScriptTranslator";
import AMOSParser from "../grammar/generated/AMOSParser";
import AMOSLexer from "../grammar/generated/AMOSLexer";

test("print_something_2", () => {
  // const amosBasicCode = `Print #1,"_COLOR_TABLE("+Right$(Str$(L),Len(Str$(L))-1)+")="+Hex$(CV)`;
  const amosBasicCode = `
  Open Out 1, TempFile
  Print #1,"Hello, World!"
  Close 1
  Open In 2, TempFile
  Input #2, A$
  Close 2
  Print A$`;

  const chars = new antlr4.InputStream(amosBasicCode);
  const lexer = new AMOSLexer(chars);
  const tokens = new antlr4.CommonTokenStream(lexer);
  const parser = new AMOSParser(tokens);

  const tree = parser.program();

  // Translate the parsed AMOS BASIC into JavaScript
  const translator = new AmosToJavaScriptTranslator();
  const walker = new antlr4.tree.ParseTreeWalker();
  walker.walk(translator, tree);
  const translatedJsCode = translator.getJavaScript(); // Get the translated JavaScript code

  let targetString = `
  const fs = require('fs');

// Dictionary to hold file streams based on channels (0-10)
const channels = {};

// Function to open a file and assign it to a channel
function openFile(fileName, channel, mode = 'w') {
console.log(fileName, 'opened on channel', channel); 
  if (channel < 0 || channel > 10) {
    throw new Error('Channel must be between 0 and 10');
  }
  const stream = fs.createWriteStream(fileName, { flags: mode });
  channels[channel] = stream;
  console.log(fileName, 'opened on channel', channel);
}

// Function to write to a file based on the assigned channel
function writeToChannel(channel, data) {
  const stream = channels[channel];
  if (!stream) {
    throw new Error('No file opened on channel', channel);
  }
  stream.write(data + '\n', 'utf8', (err) => {
    if (err) throw err;
    console.log('Data written to channel', channel);
  });
}

// Function to read from a file based on the assigned channel
  function readFromChannel(channel, callback) {
    const stream = channels[channel];
    if (!stream || !stream.readable) {
      throw new Error('No readable file opened on channel', channel);
    }
    let data = '';
    stream.on('data', chunk => data += chunk);
    stream.on('end', () => {
      callback(data.trim()); // Callback to return the read data
    });
  }

// Function to close a file channel
  function closeChannel(channel) {
    const stream = channels[channel];
    if (!stream) {
      throw new Error('No file opened on channel', channel);
    }
    stream.end(() => {
      console.log('Channel', channel, 'closed');
    });
    delete channels[channel];
  }
function Cos(angle) { return Math.cos(angle * Math.PI / 180); } function Sin(angle) { return Math.sin(angle * Math.PI / 180); } function Tan(angle) { return Math.tan(angle * Math.PI / 180); }

  openFile('TempFile', 1, 'w');
  writeToChannel(#1, \"Hello, World!\");
  closeChannel(1);
  openFile('TempFile', 2, 'r');
  let A$ = ''; 
  readFromChannel(#2, (data) => { A$ = data; });
  closeChannel(2);
  
  


  `;
  /* test */
  let normalizedTranslatedJsCode = translatedJsCode
    .replace(/\s+/g, " ")
    .trim();
  const normalizedExpectedJsCode = targetString.replace(/\s+/g, " ").trim();
  expect(normalizedTranslatedJsCode).toContain(normalizedExpectedJsCode);
});
