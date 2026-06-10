
   
    const colorMapping = {
  "1": "rgb(0, 0, 0)",
  "2": "rgb(0, 0, 170)",
  "3": "rgb(255, 255, 0)",
  "4": "rgb(255, 255, 0)",
  "5": "rgb(187, 187, 187)",
  "6": "rgb(170, 170, 170)",
  "7": "rgb(187, 187, 187)",
  "8": "rgb(204, 204, 204)"
};let MAP_SIZE = 0;
let y = 0;
let x = 0;
let PACMAN_CURRENT_SPRITE = 0;
let PACMAN_DIRECTION = 0;
let PACMAN_TURN_TO_DIRECTION = 0;
let PLAYER_DIED = 0;
let GHOST_COUNTER = 0;
let TILE_SIZE = 0;
let PX = 0;
let PY = 0;
let P_GHOST_ONE_X = 0;
let P_GHOST_ONE_Y = 0;
let P_GHOST_TWO_X = 0;
let P_GHOST_TWO_Y = 0;
let points = 0;
let POWER_PELLET = 0;
let POWER_PELLET_COUNTDOWN = 0;
let ghostOneDirection = 0;
let AlreaDYDied = 0;
let GHOST_TIMER = 0;
let CURRENT_GHOST_TIMER = 0;
let NX = 0;
let NY = 0;

    
      const keyMapping = {
        1: "Escape",
        2: "Digit1",
        3: "Digit2",
        4: "Digit3",
        5: "Digit4",
        6: "Digit5",
        7: "Digit6",
        8: "Digit7",
        9: "Digit8",
        10: "Digit9",
        11: "Digit0",
        12: "Minus",
        13: "Equal",
        14: "Backspace",
        15: "Tab",
        16: "KeyQ",
        17: "KeyW",
        18: "KeyE",
        19: "KeyR",
        20: "KeyT",
        21: "KeyY",
        22: "KeyU",
        23: "KeyI",
        24: "KeyO",
        25: "KeyP",
        26: "BracketLeft",
        27: "BracketRight",
        28: "Enter",
        29: "ControlLeft",
        30: "KeyA",
        31: "KeyS",
        32: "KeyD",
        33: "KeyF",
        34: "KeyG",
        35: "KeyH",
        36: "KeyJ",
        37: "KeyK",
        38: "KeyL",
        39: "Semicolon",
        40: "Quote",
        41: "Backquote",
        42: "ShiftLeft",
        43: "Backslash",
        44: "KeyZ",
        45: "KeyX",
        46: "KeyC",
        47: "KeyV",
        48: "KeyB",
        49: "KeyN",
        50: "KeyM",
        51: "Comma",
        52: "Period",
        53: "Slash",
        54: "ShiftRight",
        55: "NumpadMultiply",
        56: "AltLeft",
        57: "Space",
        58: "CapsLock",
        59: "F1",
        60: "F2",
        61: "F3",
        62: "F4",
        63: "F5",
        64: "F6",
        65: "F7",
        66: "F8",
        67: "F9",
        68: "F10",
        69: "Pause",
        70: "ScrollLock",
        71: "Numpad7",
        72: "Numpad8",
        73: "Numpad9",
        74: "NumpadSubtract",
        75: "Numpad4",
        76: "Numpad5",
        77: "Numpad6",
        78: "NumpadAdd",
        79: "Numpad1",
        80: "Numpad2",
        81: "Numpad3",
        82: "Numpad0",
        83: "NumpadDecimal",
        84: "IntlBackslash",
        85: "F11",
        86: "F12",
        87: "NumpadEqual",
        88: "F13",
        89: "F14",
        90: "F15",
        91: "F16",
        92: "F17",
        93: "F18",
        94: "F19",
        95: "F20",
        96: "F21",
        97: "F22",
        98: "F23",
        99: "F24",
        100: "NumpadComma",
        101: "Lang1",
        102: "Lang2",
        103: "NumpadEnter",
        104: "ControlRight",
        105: "NumpadDivide",
        106: "PrintScreen",
        107: "AltRight",
        108: "NumLock",
        109: "Home",
        110: "ArrowUp",
        111: "PageUp",
        112: "ArrowLeft",
        113: "ArrowRight",
        114: "End",
        115: "ArrowDown",
        116: "PageDown",
        117: "Insert",
        118: "Delete",
        119: "MetaLeft",
        120: "MetaRight",
        121: "ContextMenu",
        122: "Power",
        123: "AudioVolumeMute",
        124: "AudioVolumeDown",
        125: "AudioVolumeUp",
        126: "MediaTrackNext",
        127: "MediaTrackPrevious",
        128: "MediaStop",
        129: "MediaPlayPause",
        130: "LaunchMail",
        131: "MediaSelect",
        132: "LaunchApp1",
        133: "LaunchApp2",
        134: "LaunchApp3",
        135: "LaunchApp4",
        136: "BrowserSearch",
        137: "BrowserHome",
        138: "BrowserBack",
        139: "BrowserForward",
        140: "BrowserStop",
        141: "BrowserRefresh",
        142: "BrowserFavorites",
        143: "Lang3",
        144: "Lang4",
        145: "Lang5",
        146: "Lang6",
        147: "Lang7",
        148: "Lang8",
        149: "Lang9",
        150: "Lang10",
        151: "BrightnessDown",
        152: "BrightnessUp",
        153: "Eject",
        154: "Sleep",
        155: "WakeUp",
        156: "ScreenLock",
        157: "DisplaySwitch",
        158: "KbdIllumToggle",
        159: "KbdIllumDown",
        160: "KbdIllumUp",
        161: "SendMessage",
        162: "Reply",
        163: "Forward",
        164: "Save",
        165: "Documents",
        166: "Pictures",
        167: "Music",
        168: "Movies",
        169: "Calendar",
        170: "Calculator",
        171: "Memo",
        172: "ToDoList",
        173: "Phone",
        174: "Voicemail",
        175: "Contacts",
        176: "Mail",
        177: "MediaLibrary",
        178: "Search",
        179: "HomePage",
        180: "LogOff",
        181: "LockScreen",
        182: "TaskManager",
        183: "Next",
        184: "Previous",
        185: "EndCall",
        186: "AnswerCall",
        187: "MuteCall",
        188: "HoldCall",
        189: "ConferenceCall",
        190: "VolumeUp",
        191: "VolumeDown",
        192: "ZoomIn",
        193: "ZoomOut",
        194: "ScrollUp",
        195: "ScrollDown",
        196: "RotateLeft",
        197: "RotateRight",
        198: "FlipHorizontal",
        199: "FlipVertical",
        200: "Mirror",
        201: "PictureInPicture",
        202: "PictureMode",
        203: "ScreenShare",
        204: "VideoCall",
        205: "VoiceSearch",
        206: "AssistiveTouch",
        207: "Dictate",
        208: "LanguageSwitch",
        209: "Accessibility",
        210: "InputMethod",
        211: "EmojiPicker",
        212: "Camera",
        213: "PhotoLibrary",
        214: "FaceUnlock",
        215: "FingerprintScan",
        216: "IrisScan",
        217: "SmartLock",
        218: "DoNotDisturb",
        219: "NightMode",
        220: "PrivacyMode",
        221: "FlightMode",
        222: "PowerOff",
        223: "Restart",
        224: "Shutdown",
        225: "Hibernate",
        226: "RestartToBootloader",
        227: "SafeMode",
        228: "DeveloperOptions",
        229: "TakeScreenshot",
        230: "RecordScreen",
        231: "VideoPlayback",
        232: "MediaPause",
        233: "MediaRewind",
        234: "MediaFastForward",
        235: "MediaPlay",
        236: "MediaStop",
        237: "MediaRecord",
        238: "PlayPause",
        239: "PlayStop",
        240: "MediaNext"
      }
    let currentTimer = Date.now();
  let Ink = "black";
  let Paper = 1;
  let Pen = 2;
  let Timer = 0;
  let currentPressedKey = null;
  let isPressed = false;
 const keyCodes = () => {
  document.addEventListener('keydown', function (e) {

    isPressed = true;
    currentPressedKey = e.code;
  });
  document.addEventListener('keyup', function (e) {
    isPressed = false;
    currentPressedKey = null;
});
};

keyCodes();
  
  function clearDivs(idtarget) {
  const screenDiv = document.getElementById(idtarget);
  if (screenDiv) {
 screenDiv.remove(); 

  }
}
  let soundPlayerTimeTracker = 0;
const pitchToFrequency = {
    1: 16.35,   // C0
    2: 17.32,   // C#0
    3: 18.35,   // D0
    4: 19.45,   // D#0
    5: 20.60,   // E0
    6: 21.83,   // F0
    7: 23.12,   // F#0
    8: 24.50,   // G0
    9: 25.96,   // G#0
   10: 27.50,   // A0
   11: 29.14,   // A#0
   12: 30.87,   // B0
   13: 32.70,   // C1
   14: 34.65,   // C#1
   15: 36.71,   // D1
   16: 38.89,   // D#1
   17: 41.20,   // E1
   18: 43.65,   // F1
   19: 46.25,   // F#1
   20: 49.00,   // G1
   21: 51.91,   // G#1
   22: 55.00,   // A1
   23: 58.27,   // A#1
   24: 61.74,   // B1
   25: 65.41,   // C2
   26: 69.30,   // C#2
   27: 73.42,   // D2
   28: 77.78,   // D#2
   29: 82.41,   // E2
   30: 87.31,   // F2
   31: 92.50,   // F#2
   32: 98.00,   // G2
   33: 103.83,  // G#2
   34: 110.00,  // A2
   35: 116.54,  // A#2
   36: 123.47,  // B2
   37: 130.81,  // C3
   38: 138.59,  // C#3
   39: 146.83,  // D3
   40: 155.56,  // D#3
   41: 164.81,  // E3
   42: 174.61,  // F3
   43: 185.00,  // F#3
   44: 196.00,  // G3
   45: 207.65,  // G#3
   46: 220.00,  // A3
   47: 233.08,  // A#3
   48: 246.94,  // B3
   49: 261.63,  // C4
   50: 277.18,  // C#4
   51: 293.66,  // D4
   52: 311.13,  // D#4
   53: 329.63,  // E4
   54: 349.23,  // F4
   55: 369.99,  // F#4
   56: 392.00,  // G4
   57: 415.30,  // G#4
   58: 440.00,  // A4
   59: 466.16,  // A#4
   60: 493.88,  // B4
   61: 523.25,  // C5
   62: 554.37,  // C#5
   63: 587.33,  // D5
   64: 622.25,  // D#5
   65: 659.25,  // E5
   66: 698.46,  // F5
   67: 739.99,  // F#5
   68: 783.99,  // G5
   69: 830.61,  // G#5
   70: 880.00,  // A5
   71: 932.33,  // A#5
   72: 987.77,  // B5
   73: 1046.50, // C6
   74: 1108.73, // C#6
   75: 1174.66, // D6
   76: 1244.51, // D#6
   77: 1318.51, // E6
   78: 1396.91, // F6
   79: 1479.98, // F#6
   80: 1567.98, // G6
   81: 1661.22, // G#6
   82: 1760.00, // A6
   83: 1864.66, // A#6
   84: 1975.53, // B6
   85: 2093.00, // C7
   86: 2217.46, // C#7
   87: 2349.32, // D7
   88: 2489.02, // D#7
   89: 2637.02, // E7
   90: 2793.83, // F7
   91: 2959.96, // F#7
   92: 3135.96, // G7
   93: 3322.44, // G#7
   94: 3520.00, // A7
   95: 3729.31, // A#7
   96: 3951.07, // B7
};

let activeOscillators = {}; // Object to store active oscillators keyed by noteId

function soundPlayer(noteId, cooldown) {
     let currentTime = Date.now();

    if (currentTime - soundPlayerTimeTracker > cooldown/2) {
        soundPlayerTimeTracker = currentTime;

        const frequency = pitchToFrequency[noteId];

        // Check if there's already an oscillator for this noteId
        if (activeOscillators[noteId]) {
            // Stop the existing oscillator
            activeOscillators[noteId].stop();
            activeOscillators[noteId].disconnect(); // Disconnect it from the audio context
        }

        // Create a new AudioContext for the new oscillator
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        // Create a GainNode for controlling volume
        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime); // Start at zero gain (silent)

        // Create a new oscillator
        const oscillator = audioCtx.createOscillator();

        // Set the frequency of the oscillator
        oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

        // Create a custom waveform using PeriodicWave
        const real = new Float32Array([0, 1, 0.5, 0.25, 0.125]); // Amplitude of harmonics
        const imag = new Float32Array(real.length); // Zero phase shift
        const customWave = audioCtx.createPeriodicWave(real, imag);

        // Set the custom waveform to the oscillator
        oscillator.setPeriodicWave(customWave);

        // Connect the oscillator to the gain node, then to the audio context's destination (the speakers)
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        // Resume the AudioContext and start the oscillator
        audioCtx.resume().then(() => {
            // Apply fade-in (linear ramp to full volume over 50ms)
            gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.05);

            // Start the oscillator
            oscillator.start();

            // Schedule the fade-out (linear ramp to zero gain 50ms before the sound stops)
            gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.95);

            // Store the oscillator in the activeOscillators object
            activeOscillators[noteId] = oscillator;

            // Stop the oscillator after 1 second and remove it from the activeOscillators object
            oscillator.stop(audioCtx.currentTime + 1);
            oscillator.onended = () => {
                delete activeOscillators[noteId];
            };
        });
    }
}



// Dictionary to hold file streams based on channels (0-10)
const channels = {};
function randomInt(max) {
const random = Math.floor(Math.random() * (max - 0 + 1)) + 0

  return random}
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


    function Cos(angle) {
    return Math.cos(angle * Math.PI / 180);
}
   


function Sin(angle) {
    return Math.sin(angle * Math.PI / 180);
}

function Tan(angle) {
    return Math.tan(angle * Math.PI / 180);
}

function Qsin(angle, radius) {
    return Math.round(radius * Math.sin(angle * Math.PI / 512));
}

function Qcos(angle, radius) {
    return Math.round(radius * Math.cos(angle * Math.PI / 512));
}
let bankData = {
  1: {
  sprites: [],
  processing: false,
  palette: [],
  },
  2: {
  sprites: [],
  processing: false,
  palette: [],
  },
  3: {
  sprites: [],
  processing: false,
  palette: [],
  },
  4: {
  sprites: [],
  processing: false,
  palette: [],
  },
  5: {
  sprites: [],
  processing: false,
  palette: [],
  },

  }
function loadBank(bankName, bank) {
 let bankFileType = bankName.split('.').pop().toLowerCase();
  bankFileType = bankFileType.replace('"', ''); // Remove any non-alphanumeric characters

  if(bankFileType !== "abk"){
    console.error("Invalid file type. Please select a .abk file."); 
    return;
  }
  
  if(bankData[bank].processing === true){
  
  for(let i = 0; i< 5 ; i++){
        if(bankData[i + 1].processing == false){
     console.log("Bank", i + 1, " is free");
     bank = i + 1; // Set the bank to the first available slot with sprites
     bankData[bank].processing = true;
     break;
            }
   }
   if(bank == 1){
     console.log("Bank slots are full");
     return;
   }
  
  
  }else{
    bankData[bank].processing = true;
  }



  // 1) Try the posted bytes (by id or by a name match)
  let file = (window.__getBankFile && window.__getBankFile(bank, bankName)) || null;

  // 2) Fallback to legacy input (only if you also render inputs inside the iframe)
  if (!file) {
    const findElementId = "bankStored" + bank;
    const inputElement = document.getElementById(findElementId);
    file = inputElement?.files?.[0];
    console.log("Storing bank (legacy input):", inputElement?.id);
  }

  if (!file) {
    console.log("Bank failed to be loaded: No file was selected or posted");
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    const arrayBuffer = e.target.result; // The result is now an ArrayBuffer
    const buffer = new Uint8Array(arrayBuffer); // Convert to Uint8Array for easier byte manipulation

    let offset = 6; // Adjust the starting offset as per the file format
    const numberExpected = (buffer[4] << 8) | buffer[5]; // Check this is correct
   

    let objectsArray = [];
    
    for (let i = 0; i < numberExpected; i++) {
      const width = (buffer[offset] << 8) | buffer[offset + 1];
      const height = (buffer[offset + 2] << 8) | buffer[offset + 3];
      const depth = (buffer[offset + 4] << 8) | buffer[offset + 5];
      const hotspotX = (buffer[offset + 6] << 8) | buffer[offset + 7];
      const hotspotY = (buffer[offset + 8] << 8) | buffer[offset + 9];

      

      const planarGraphicData = [];
      const dataSize = width * 2 * height * depth; // Ensure this calculation is correct

      for (let j = 0; j < dataSize; j++) {
        planarGraphicData.push(buffer[offset + 10 + j]);
      }

      const objectBuilder = {
        width,
        height,
        depth,
        hotspotX,
        hotspotY,
        planarGraphicData,
      };

      objectsArray.push(objectBuilder);
      offset += 10 + dataSize;
    }

    // Initialize colorPalette to hold 32 colors (64 bytes in total)
    let colorPalette = [];

    // Loop through each pair of bytes in the color palette section (32 colors x 2 bytes)
    for (let k = offset; k < offset + 64; k += 2) {
      const byte1 = buffer[k];
      const byte2 = buffer[k + 1];

      const color1 = (byte1 << 8) | byte2;

      // Extract the red, green, and blue components (4 bits each)
      const red = (color1 >> 8) & 0xF;
      const green = (color1 >> 4) & 0xF;
      const blue = color1 & 0xF;

      // Convert 4-bit values (0-15) to 8-bit values (0-255) by multiplying by 17
      const red8 = (red * 17).toString(16).padStart(2, "0");
      const green8 = (green * 17).toString(16).padStart(2, "0");
      const blue8 = (blue * 17).toString(16).padStart(2, "0");

      // Format as HTML color code #RRGGBB
      const color = '#' + red8 + green8 + blue8;
     
      
      colorPalette.push(color.toUpperCase());
      

    }

    
    
    if(bankData[1].sprites.length > 0){
     
  
    // Merge the new sprites and palette with the existing ones
    bankData[1].sprites = [...bankData[1].sprites, ...objectsArray
    ];
    bankData[1].palette = [...bankData[1].palette, ...colorPalette
    ];
   
    }else {
      console.log("Bank 1 does not exist, creating new bank slot");
    
    bankData[bank].sprites = objectsArray;
    bankData[bank].palette = colorPalette;
    if(bankData[bank].sprites.length > 0){
    console.log("Loaded bank slot:", bank, "with", bankData[bank].sprites.length, "sprites", "and color palette: ", bankData[bank].palette);
    }else{
       console.log('Bank',  bankId, 'failed to be loaded', ' on bank slot:', bank);
    }
        console.log("Bank data updated:", bankData[bank]);
      }
   
  };

  reader.readAsArrayBuffer(file); // Use readAsArrayBuffer for binary data
}
let tries = 0;
function renderSprite(spriteNumber, x, y, bankImgIndex) {
  if(tries > 40){

   console.error("Bank not found or could not be loaded");
   location.reload();
   return;
  }
   if (!bankData[1].sprites[bankImgIndex]) {
    
    tries++;
    setTimeout(() => {
        renderSprite(spriteNumber, x, y, bankImgIndex);
      }, 200);
      
    return;
  }

  let { width, height, depth, planarGraphicData } = bankData[1].sprites[bankImgIndex];
  let colorPalette = bankData[1].palette;
  width = width * 16; // Convert width in 16-bit words to pixels

  const pixels = [];
  const bytesPerRow = width / 8;
  const rowSize = bytesPerRow * depth;

  // Build pixels array with hex color values based on the planar graphic data
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let colorIndex = 0;

      // Build colorIndex by combining bits across planes
      for (let plane = 0; plane < depth; plane++) {
        const byteIndex = y * bytesPerRow + plane * (height * bytesPerRow) + Math.floor(x / 8);
        const bitPos = 7 - (x % 8);
        const bit = (planarGraphicData[byteIndex] >> bitPos) & 1;

        colorIndex |= bit << plane;
      }

      const hexColor = colorPalette[colorIndex];
      pixels.push(hexColor);
    }
  }
 let spriteContainerCheck = document.getElementById("sprite" + spriteNumber);

// If the sprite container already exists, remove it from the DOM
if (spriteContainerCheck) {
  spriteContainerCheck.remove();
}

// Create a container div for the new sprite
const spriteContainer = document.createElement("div");
spriteContainer.style.display = "grid";
spriteContainer.style.gridTemplateColumns = "repeat(" + width + ", 1fr)";
spriteContainer.style.position = "absolute";
spriteContainer.style.left = x + "px";
spriteContainer.style.top = y + "px";
spriteContainer.id = "sprite" + spriteNumber; // Assign the ID for future reference
spriteContainer.style.zIndex = 99999;
// Append the new sprite container to the document body (or a specific parent container)
document.body.appendChild(spriteContainer);

// Continue rendering the sprite's pixels
pixels.forEach((color) => {
  if(color === colorPalette[0]){
  const pixel = document.createElement("div");
  pixel.style.width = "1px";
  pixel.style.height = "1px";
  pixel.style.backgroundColor = "transparent";
  spriteContainer.appendChild(pixel);
  }else{
    const pixel = document.createElement("div");
    pixel.style.width = "1px";
    pixel.style.height = "1px";
    pixel.style.backgroundColor = color;
    spriteContainer.appendChild(pixel);
  }
});


  // Append the container to the document body or a specific container element
  document.getElementById('amos-screen').appendChild(spriteContainer);
}
  
const screenDiv = document.createElement('div');
screenDiv.style.width = '670px';
screenDiv.style.height = '847px';
screenDiv.style.border = '1px solid red';
screenDiv.style.overflow = 'hidden'; 
screenDiv.style.padding = '0'; 
screenDiv.style.position = 'relative'; 
screenDiv.id = 'amos-screen'; 
screenDiv.style.zIndex = 1;
document.getElementById('game-container').appendChild(screenDiv);
document.getElementById('amos-screen').style.backgroundColor = colorMapping[1];
        
document.getElementById('amos-screen').style.cursor = 'none';   
        
Paper = 0;
    
  
  loadBank('"pacman.abk"', 1);
                  
      
Pen = 1;
    
        MAP_SIZE = 30;
          const map = new Array((MAP_SIZE + 1));
for (let i = 0; i < (MAP_SIZE + 1); i++) map[i] = new Array((MAP_SIZE + 1));
const POINTS_MAP_X = new Array((MAP_SIZE + 1));
const POINTS_MAP_Y = new Array((MAP_SIZE + 1));
const COLLECTED = new Array((MAP_SIZE + 1));
for (let i = 0; i < (MAP_SIZE + 1); i++) COLLECTED[i] = new Array((MAP_SIZE + 1));
for (y = 0; y <= MAP_SIZE; y++) {  for (x = 0; x <= MAP_SIZE; x++) {    COLLECTED[y][x] = 0;
  }}const dataMatrix = [];
dataMatrix.push([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
dataMatrix.push([1, 3, 3, 3, 3, 3, 5, 3, 3, 3, 3, 3, 3, 1, 1, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 1]);
dataMatrix.push([1, 3, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 3, 1]);
dataMatrix.push([1, 3, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 3, 1]);
dataMatrix.push([1, 3, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 3, 1]);
dataMatrix.push([1, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1]);
dataMatrix.push([1, 3, 1, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 3, 1]);
dataMatrix.push([1, 3, 1, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 3, 1]);
dataMatrix.push([1, 3, 3, 3, 3, 3, 3, 1, 1, 3, 3, 3, 3, 1, 1, 3, 3, 3, 3, 1, 1, 3, 3, 3, 3, 3, 3, 1]);
dataMatrix.push([1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1]);
dataMatrix.push([1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 7, 1, 1, 1, 1, 1, 1]);
dataMatrix.push([1, 1, 1, 1, 1, 1, 3, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1]);
dataMatrix.push([1, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 0, 0, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1]);
dataMatrix.push([1, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 0, 0, 0, 0, 0, 0, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1]);
dataMatrix.push([3, 3, 3, 3, 3, 3, 3, 3, 3, 8, 1, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3]);
dataMatrix.push([1, 1, 1, 1, 1, 1, 3, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1]);
dataMatrix.push([1, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1]);
dataMatrix.push([1, 1, 1, 1, 1, 1, 3, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1]);
dataMatrix.push([1, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1]);
dataMatrix.push([1, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1]);
dataMatrix.push([1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1]);
dataMatrix.push([1, 3, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 3, 1]);
dataMatrix.push([1, 6, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 3, 1]);
dataMatrix.push([1, 3, 4, 3, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 3, 3, 3, 1]);
dataMatrix.push([1, 1, 1, 3, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 1, 3, 1, 1, 1]);
dataMatrix.push([1, 1, 1, 3, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 1, 3, 1, 1, 1]);
dataMatrix.push([1, 3, 3, 3, 3, 3, 3, 1, 1, 3, 3, 3, 3, 1, 1, 3, 3, 3, 3, 1, 1, 3, 3, 3, 3, 3, 3, 1]);
dataMatrix.push([1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1]);
dataMatrix.push([1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1]);
dataMatrix.push([1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 1]);
dataMatrix.push([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
for (y = 0; y <= MAP_SIZE; y++) {  for (x = 0; x <= MAP_SIZE; x++) {    map[y][x] = dataMatrix[y][x];
  }}
        PACMAN_CURRENT_SPRITE = 1;
          
        PACMAN_DIRECTION = 0;
          
        PACMAN_TURN_TO_DIRECTION = 0;
          
        PLAYER_DIED = 0;
          
        GHOST_COUNTER = 0;
          
        TILE_SIZE = 24;
          
        PX = 14;
          
        PY = 23;
          
        P_GHOST_ONE_X = 12;
          
        P_GHOST_ONE_Y = 13;
          
        P_GHOST_TWO_X = 14;
          
        P_GHOST_TWO_Y = 15;
          
        points = 0;
          
        POWER_PELLET = 0;
          
        POWER_PELLET_COUNTDOWN = 0;
          
        ghostOneDirection = 0;
          
        AlreaDYDied = 0;
          
        GHOST_TIMER = 1;
          
        CURRENT_GHOST_TIMER = GHOST_TIMER;
          Ink = "rgb(255, 255, 0)";
const textDiv10780 = document.createElement('div');
textDiv10780.innerText = 'Points:';
textDiv10780.id = 'textDiv' + '10' + '780';
textDiv10780.style.position = 'absolute';
textDiv10780.style.left = '10px';
textDiv10780.style.top = '780px';
textDiv10780.style.fontSize = '14px';
textDiv10780.style.color = Ink;
textDiv10780.style.position = "Relative";
textDiv10780.style.zIndex = 99;
document.getElementById('amos-screen').appendChild(textDiv10780);
        
        
const textDiv130780 = document.createElement('div');
textDiv130780.innerText = points;
textDiv130780.id = 'textDiv' + '130' + '780';
textDiv130780.style.position = 'fixed';
textDiv130780.style.left = '130px';
textDiv130780.style.top = '780px';
textDiv130780.style.fontSize = '14px';
textDiv130780.style.color = Ink;

textDiv130780.style.zIndex = 99;
document.getElementById('amos-screen').appendChild(textDiv130780);
      setInterval(() => {
  textDiv130780.innerText = points; // Function that returns updated value
}, 100); 
        
const textDiv340770 = document.createElement('div');
textDiv340770.innerText = 'x:';
textDiv340770.id = 'textDiv' + '340' + '770';
textDiv340770.style.position = 'absolute';
textDiv340770.style.left = '340px';
textDiv340770.style.top = '770px';
textDiv340770.style.fontSize = '14px';
textDiv340770.style.color = Ink;
textDiv340770.style.position = "Relative";
textDiv340770.style.zIndex = 99;
document.getElementById('amos-screen').appendChild(textDiv340770);
        
        
const textDiv370790 = document.createElement('div');
textDiv370790.innerText = PX;
textDiv370790.id = 'textDiv' + '370' + '790';
textDiv370790.style.position = 'fixed';
textDiv370790.style.left = '370px';
textDiv370790.style.top = '790px';
textDiv370790.style.fontSize = '14px';
textDiv370790.style.color = Ink;

textDiv370790.style.zIndex = 99;
document.getElementById('amos-screen').appendChild(textDiv370790);
      setInterval(() => {
  textDiv370790.innerText = PX; // Function that returns updated value
}, 100); 
        
const textDiv400750 = document.createElement('div');
textDiv400750.innerText = 'y:';
textDiv400750.id = 'textDiv' + '400' + '750';
textDiv400750.style.position = 'absolute';
textDiv400750.style.left = '400px';
textDiv400750.style.top = '750px';
textDiv400750.style.fontSize = '14px';
textDiv400750.style.color = Ink;
textDiv400750.style.position = "Relative";
textDiv400750.style.zIndex = 99;
document.getElementById('amos-screen').appendChild(textDiv400750);
        
        
const textDiv430790 = document.createElement('div');
textDiv430790.innerText = PY;
textDiv430790.id = 'textDiv' + '430' + '790';
textDiv430790.style.position = 'fixed';
textDiv430790.style.left = '430px';
textDiv430790.style.top = '790px';
textDiv430790.style.fontSize = '14px';
textDiv430790.style.color = Ink;

textDiv430790.style.zIndex = 99;
document.getElementById('amos-screen').appendChild(textDiv430790);
      setInterval(() => {
  textDiv430790.innerText = PY; // Function that returns updated value
}, 100); 
        Ink = "rgb(0, 0, 170)";
const textDiv10691 = document.createElement('div');
textDiv10691.innerText = 'Power pellet!';
textDiv10691.id = 'textDiv' + '10' + '691';
textDiv10691.style.position = 'absolute';
textDiv10691.style.left = '10px';
textDiv10691.style.top = '691px';
textDiv10691.style.fontSize = '14px';
textDiv10691.style.color = Ink;
textDiv10691.style.position = "Relative";
textDiv10691.style.zIndex = 99;
document.getElementById('amos-screen').appendChild(textDiv10691);
        Ink = "rgb(255, 255, 0)";
    let lastTimeMoveGhosts = 0; 
    let timeoutIdMoveGhosts = null; // Track the timeout ID
const MoveGhosts = (a) => {
  const currentTime = Date.now();
  const timeSinceLastCall = currentTime - lastTimeMoveGhosts;
  
  if (timeSinceLastCall < 16) {
    if (timeoutIdMoveGhosts) clearTimeout(timeoutIdMoveGhosts); // Clear any existing timeout
    timeoutIdMoveGhosts = setTimeout(() => {
      MoveGhosts(a); 
    }, 100 - timeSinceLastCall);
    return;
  }
  lastTimeMoveGhosts = currentTime;
  timeoutIdMoveGhosts = null; // Clear the timeout ID after execution
  let y = 0;
  let x = 0;
        
          let DX = 0;
          DX = 0;
          
          let DY = 0;
          DY = 0;
          
          let DXone = 0;
          DXone = randomInt(1);
          
    
  if (PX > P_GHOST_ONE_X) {
        
         DX = 1;
          
  }
    
  if (PX < P_GHOST_ONE_X) {
        
         DX = 2;
          
  }
    
  if (PY > P_GHOST_ONE_Y) {
        
         DY = 1;
          
  }
    
  if (PY < P_GHOST_ONE_Y) {
        
         DY = 2;
          
  }
    
  if (DX != 0) {
        
         DY = 0;
          
  }
          let previousOneX = 0;
          previousOneX = P_GHOST_ONE_X;
          
          let previousOneY = 0;
          previousOneY = P_GHOST_ONE_Y;
          
          let previousTwoX = 0;
          previousTwoX = P_GHOST_TWO_X;
          
          let previousTwoY = 0;
          previousTwoY = P_GHOST_TWO_Y;
          
          let random_movement = 0;
          random_movement = randomInt(3);
          
    
  if (random_movement != 0) {
        
    
    if (DX == 1) {
        
              let tx = 0;
              tx = P_GHOST_ONE_X+1;
          
              let ty = 0;
              ty = P_GHOST_ONE_Y;
          
              let valid = 0;
              valid = 0;
          
    
      if (map[ty][tx] == 0) {
        
             valid = 1;
          }else {
    
          if (map[ty][tx] == 3) {
        
                 valid = 1;
          }else {
    
              if (map[ty][tx] == 4) {
        
                     valid = 1;
          
              }
          }
      }
    
      if (valid == 1) {
        
             P_GHOST_ONE_X = tx;
          
    
        if (P_GHOST_ONE_X == P_GHOST_TWO_X) {
        
               P_GHOST_ONE_X = previousOneX;
          
        }
      }
    }
    
    if (DX == 2) {
        
           tx = P_GHOST_ONE_X-1;
          
           ty = P_GHOST_ONE_Y;
          
           valid = 0;
          
    
      if (map[ty][tx] == 0) {
        
             valid = 1;
          }else {
    
          if (map[ty][tx] == 3) {
        
                 valid = 1;
          }else {
    
              if (map[ty][tx] == 4) {
        
                     valid = 1;
          
              }
          }
      }
    
      if (valid == 1) {
        
             P_GHOST_ONE_X = tx;
          
    
        if (P_GHOST_ONE_X == P_GHOST_TWO_X) {
        
               P_GHOST_ONE_X = previousOneX;
          
        }
      }}else {
    
        if (DY == 1) {
        
               tx = P_GHOST_ONE_X;
          
               ty = P_GHOST_ONE_Y+1;
          
               valid = 0;
          
    
          if (map[ty][tx] == 0) {
        
                 valid = 1;
          }else {
    
              if (map[ty][tx] == 3) {
        
                     valid = 1;
          }else {
    
                  if (map[ty][tx] == 4) {
        
                         valid = 1;
          
                  }
              }
          }
    
          if (valid == 1) {
        
                 P_GHOST_ONE_Y = ty;
          
    
            if (P_GHOST_ONE_Y == P_GHOST_TWO_Y) {
        
                   P_GHOST_ONE_Y = previousOneY;
          
            }
          }}else {
    
            if (DY == 2) {
        
                   tx = P_GHOST_ONE_X;
          
                   ty = P_GHOST_ONE_Y-1;
          
                   valid = 0;
          
    
              if (map[ty][tx] == 0) {
        
                     valid = 1;
          }else {
    
                  if (map[ty][tx] == 3) {
        
                         valid = 1;
          }else {
    
                      if (map[ty][tx] == 4) {
        
                             valid = 1;
          
                      }
                  }
              }
    
              if (valid == 1) {
        
                     P_GHOST_ONE_Y = ty;
          
    
                if (P_GHOST_ONE_Y == P_GHOST_TWO_Y) {
        
                       P_GHOST_ONE_Y = previousOneY;
          
                }
              }
            }
        }
    }}else {
    
      if (DX == 1) {
        
    
        if (DXone == 0) {
        
    
          if (map[P_GHOST_ONE_Y+1][P_GHOST_ONE_X] == 0) {
        
                 P_GHOST_ONE_Y = P_GHOST_ONE_Y+1;
          
          }
    
          if (map[P_GHOST_ONE_Y+1][P_GHOST_ONE_X] == 2) {
        
                 P_GHOST_ONE_Y = P_GHOST_ONE_Y+1;
          
          }
    
          if (map[P_GHOST_ONE_Y+1][P_GHOST_ONE_X] == 3) {
        
                 P_GHOST_ONE_Y = P_GHOST_ONE_Y+1;
          
          }}else {
    
            if (map[P_GHOST_ONE_Y-1][P_GHOST_ONE_X] == 0) {
        
                   P_GHOST_ONE_Y = P_GHOST_ONE_Y-1;
          
            }
    
            if (map[P_GHOST_ONE_Y-1][P_GHOST_ONE_X] == 2) {
        
                   P_GHOST_ONE_Y = P_GHOST_ONE_Y-1;
          
            }
    
            if (map[P_GHOST_ONE_Y-1][P_GHOST_ONE_X] == 3) {
        
                   P_GHOST_ONE_Y = P_GHOST_ONE_Y-1;
          
            }
        }
      }
    
      if (DX == 2) {
        
    
        if (map[P_GHOST_ONE_Y+1][P_GHOST_ONE_X] == 0) {
        
               P_GHOST_ONE_Y = P_GHOST_ONE_Y+1;
          
        }
    
        if (map[P_GHOST_ONE_Y+1][P_GHOST_ONE_X] == 2) {
        
               P_GHOST_ONE_Y = P_GHOST_ONE_Y+1;
          
        }
    
        if (map[P_GHOST_ONE_Y+1][P_GHOST_ONE_X] == 3) {
        
               P_GHOST_ONE_Y = P_GHOST_ONE_Y+1;
          
        }}else {
    
          if (map[P_GHOST_ONE_Y-1][P_GHOST_ONE_X] == 0) {
        
                 P_GHOST_ONE_Y = P_GHOST_ONE_Y-1;
          
          }
    
          if (map[P_GHOST_ONE_Y-1][P_GHOST_ONE_X] == 2) {
        
                 P_GHOST_ONE_Y = P_GHOST_ONE_Y-1;
          
          }
    
          if (map[P_GHOST_ONE_Y-1][P_GHOST_ONE_X] == 3) {
        
                 P_GHOST_ONE_Y = P_GHOST_ONE_Y-1;
          
          }
      }
    
      if (DY == 1) {
        
    
        if (DXone == 0) {
        
    
          if (map[P_GHOST_ONE_Y][P_GHOST_ONE_X+1] == 0) {
        
                 P_GHOST_ONE_X = P_GHOST_ONE_X+1;
          
          }
    
          if (map[P_GHOST_ONE_Y][P_GHOST_ONE_X+1] == 2) {
        
                 P_GHOST_ONE_X = P_GHOST_ONE_X+1;
          
          }
    
          if (map[P_GHOST_ONE_Y][P_GHOST_ONE_X+1] == 3) {
        
                 P_GHOST_ONE_X = P_GHOST_ONE_X+1;
          
          }}else {
    
            if (map[P_GHOST_ONE_Y][P_GHOST_ONE_X-1] == 0) {
        
                   P_GHOST_ONE_X = P_GHOST_ONE_X-1;
          
            }
    
            if (map[P_GHOST_ONE_Y][P_GHOST_ONE_X-1] == 2) {
        
                   P_GHOST_ONE_X = P_GHOST_ONE_X-1;
          
            }
    
            if (map[P_GHOST_ONE_Y][P_GHOST_ONE_X-1] == 3) {
        
                   P_GHOST_ONE_X = P_GHOST_ONE_X-1;
          
            }
        }
      }
    
      if (DY == 2) {
        
    
        if (DXone == 0) {
        
    
          if (map[P_GHOST_ONE_Y][P_GHOST_ONE_X+1] != 0) {
        
                 P_GHOST_ONE_X = P_GHOST_ONE_X+1;
          
          }}else {
    
            if (map[P_GHOST_ONE_Y][P_GHOST_ONE_X-1] != 0) {
        
                   P_GHOST_ONE_X = P_GHOST_ONE_X-1;
          
            }
        }
      }
  }
          let DX2 = 0;
          DX2 = randomInt(3)-1;
          
          let DY2 = 0;
          DY2 = randomInt(3)-1;
          
    
  if (DX2 == 1) {
        
    
    if (map[P_GHOST_TWO_Y][P_GHOST_TWO_X+1] == 0) {
        
           P_GHOST_TWO_X = P_GHOST_TWO_X+DX2;
          
    
      if (P_GHOST_TWO_X == P_GHOST_ONE_X) {
        
             P_GHOST_TWO_X = previousTwoX;
          
      }
    }
  }
    
  if (DX2 == 2) {
        
    
    if (map[P_GHOST_TWO_Y][P_GHOST_TWO_X-1] == 0) {
        
           P_GHOST_TWO_X = P_GHOST_TWO_X-1;
          
    
      if (P_GHOST_TWO_X == P_GHOST_ONE_X) {
        
             P_GHOST_TWO_X = previousTwoX;
          
      }
    }
  }
    
  if (DY2 == 1) {
        
    
    if (map[P_GHOST_TWO_Y+1][P_GHOST_TWO_X] == 0) {
        
           P_GHOST_TWO_Y = P_GHOST_TWO_Y+1;
          
    
      if (P_GHOST_TWO_Y == P_GHOST_ONE_Y) {
        
             P_GHOST_TWO_Y = previousTwoY;
          
      }
    }
  }
    
  if (DY2 == 2) {
        
    
    if (map[P_GHOST_TWO_Y-1][P_GHOST_TWO_X] == 0) {
        
           P_GHOST_TWO_Y = P_GHOST_TWO_Y-1;
          
    
      if (P_GHOST_TWO_Y == P_GHOST_ONE_Y) {
        
             P_GHOST_TWO_Y = previousTwoY;
          
      }
    }
  }
}

    let lastTimeP_DRAWMAP = 0; 
    let timeoutIdP_DRAWMAP = null; // Track the timeout ID
const P_DRAWMAP = (a) => {
  const currentTime = Date.now();
  const timeSinceLastCall = currentTime - lastTimeP_DRAWMAP;
  
  if (timeSinceLastCall < 16) {
    if (timeoutIdP_DRAWMAP) clearTimeout(timeoutIdP_DRAWMAP); // Clear any existing timeout
    timeoutIdP_DRAWMAP = setTimeout(() => {
      P_DRAWMAP(a); 
    }, 100 - timeSinceLastCall);
    return;
  }
  lastTimeP_DRAWMAP = currentTime;
  timeoutIdP_DRAWMAP = null; // Clear the timeout ID after execution
  let y = 0;
  let x = 0;
        
    
  if (P_GHOST_TWO_X == PX) {
        
    
    if (P_GHOST_TWO_Y == PY) {
        
           PLAYER_DIED = 1;
          
    }
  }
    
  if (P_GHOST_ONE_X == PX) {
        
    
    if (P_GHOST_ONE_Y == PY) {
        
           PLAYER_DIED = 1;
          
    }
  }  for (y = 0; y <= MAP_SIZE; y++) {    for (x = 0; x <= MAP_SIZE; x++) {
              let x13 = 0;
              x13 = x*TILE_SIZE;
          
              let y13 = 0;
              y13 = y*TILE_SIZE;
          
              let x23 = 0;
              x23 = x13+TILE_SIZE-1;
          
              let y23 = 0;
              y23 = y13+TILE_SIZE-1;
          
              let tileRendered = 0;
              tileRendered = 0;
          
    
      if (map[y][x] == 1) {
        Ink = "rgb(0, 0, 0)";
    const idBar = "Bar_" + (x13) + "_" + (y13);
    const x1 = x13;
    const y1 = y13;
    const x2 = x23;
    const y2 = y23;
    const width = x2 - x1;
    const height = y2 - y1;

    let screenBarDiv = document.getElementById(idBar);

    if (!screenBarDiv) {
        screenBarDiv = document.createElement('div');
        screenBarDiv.id = idBar;
        screenBarDiv.style.position = 'absolute';
        screenBarDiv.style.boxSizing = 'border-box';
        document.getElementById('amos-screen').appendChild(screenBarDiv);
    }

    screenBarDiv.style.backgroundColor = Ink;
    screenBarDiv.style.left = x1 + 'px';
    screenBarDiv.style.top = y1 + 'px';
    screenBarDiv.style.width = width + 'px';
    screenBarDiv.style.height = height + 'px';
    screenBarDiv.style.zIndex = 10;
  
             tileRendered = 1;
          
      }
    
      if (map[y][x] == 3) {
        Ink = "rgb(0, 0, 170)";
                let renderPoints = 0;
                renderPoints = 1;
          
    
        if (COLLECTED[y][x] == 1) {
        
               renderPoints = 0;
          
        }
    
        if (renderPoints == 1) {
        
    const idBar = "Bar_" + (x13) + "_" + (y13);
    const x1 = x13;
    const y1 = y13;
    const x2 = x23;
    const y2 = y23;
    const width = x2 - x1;
    const height = y2 - y1;

    let screenBarDiv = document.getElementById(idBar);

    if (!screenBarDiv) {
        screenBarDiv = document.createElement('div');
        screenBarDiv.id = idBar;
        screenBarDiv.style.position = 'absolute';
        screenBarDiv.style.boxSizing = 'border-box';
        document.getElementById('amos-screen').appendChild(screenBarDiv);
    }

    screenBarDiv.style.backgroundColor = Ink;
    screenBarDiv.style.left = x1 + 'px';
    screenBarDiv.style.top = y1 + 'px';
    screenBarDiv.style.width = width + 'px';
    screenBarDiv.style.height = height + 'px';
    screenBarDiv.style.zIndex = 10;
  Ink = "rgb(255, 255, 0)";
    const circleId = "Circle_" + (x*TILE_SIZE+12) + "_" + (y*TILE_SIZE+12) + "_" + (2);
    let circleDiv = document.getElementById(circleId);
    if (!circleDiv) {
      circleDiv = document.createElement('div');
      circleDiv.id = circleId;
      circleDiv.style.position = 'absolute';
      circleDiv.style.boxSizing = 'border-box';
      document.getElementById('amos-screen').appendChild(circleDiv);
      }
    circleDiv.style.borderRadius = '50%';
    circleDiv.style.border = '2px solid ' + Ink;
    circleDiv.style.left = (x*TILE_SIZE+12 - 2) + 'px';
    circleDiv.style.top = (y*TILE_SIZE+12 - 2) + 'px';
    circleDiv.style.width = (2 * 2) + 'px';
    circleDiv.style.height = (2 * 2) + 'px';
    circleDiv.style.zIndex = 10;
    circleDiv.style.backgroundColor = Ink; 
  }else {Ink = "rgb(0, 0, 170)";
    const idBar = "Bar_" + (x13) + "_" + (y13);
    const x1 = x13;
    const y1 = y13;
    const x2 = x23;
    const y2 = y23;
    const width = x2 - x1;
    const height = y2 - y1;

    let screenBarDiv = document.getElementById(idBar);

    if (!screenBarDiv) {
        screenBarDiv = document.createElement('div');
        screenBarDiv.id = idBar;
        screenBarDiv.style.position = 'absolute';
        screenBarDiv.style.boxSizing = 'border-box';
        document.getElementById('amos-screen').appendChild(screenBarDiv);
    }

    screenBarDiv.style.backgroundColor = Ink;
    screenBarDiv.style.left = x1 + 'px';
    screenBarDiv.style.top = y1 + 'px';
    screenBarDiv.style.width = width + 'px';
    screenBarDiv.style.height = height + 'px';
    screenBarDiv.style.zIndex = 10;
  
    const circleId = "Circle_" + (x*TILE_SIZE+12) + "_" + (y*TILE_SIZE+12) + "_" + (10);
    let circleDiv = document.getElementById(circleId);
    if (!circleDiv) {
      circleDiv = document.createElement('div');
      circleDiv.id = circleId;
      circleDiv.style.position = 'absolute';
      circleDiv.style.boxSizing = 'border-box';
      document.getElementById('amos-screen').appendChild(circleDiv);
      }
    circleDiv.style.borderRadius = '50%';
    circleDiv.style.border = '2px solid ' + Ink;
    circleDiv.style.left = (x*TILE_SIZE+12 - 10) + 'px';
    circleDiv.style.top = (y*TILE_SIZE+12 - 10) + 'px';
    circleDiv.style.width = (10 * 2) + 'px';
    circleDiv.style.height = (10 * 2) + 'px';
    circleDiv.style.zIndex = 10;
    circleDiv.style.backgroundColor = Ink; 
  
        }
             tileRendered = 1;
          
      }
    
      if (map[y][x] == 4) {
        
             renderPoints = 1;
          
    
        if (COLLECTED[y][x] == 1) {
        
               renderPoints = 0;
          
        }
    
        if (renderPoints == 1) {
        Ink = "rgb(0, 0, 170)";
    const idBar = "Bar_" + (x13) + "_" + (y13);
    const x1 = x13;
    const y1 = y13;
    const x2 = x23;
    const y2 = y23;
    const width = x2 - x1;
    const height = y2 - y1;

    let screenBarDiv = document.getElementById(idBar);

    if (!screenBarDiv) {
        screenBarDiv = document.createElement('div');
        screenBarDiv.id = idBar;
        screenBarDiv.style.position = 'absolute';
        screenBarDiv.style.boxSizing = 'border-box';
        document.getElementById('amos-screen').appendChild(screenBarDiv);
    }

    screenBarDiv.style.backgroundColor = Ink;
    screenBarDiv.style.left = x1 + 'px';
    screenBarDiv.style.top = y1 + 'px';
    screenBarDiv.style.width = width + 'px';
    screenBarDiv.style.height = height + 'px';
    screenBarDiv.style.zIndex = 10;
  Ink = "rgb(255, 255, 0)";
    const circleId = "Circle_" + (x*TILE_SIZE+12) + "_" + (y*TILE_SIZE+12) + "_" + (8);
    let circleDiv = document.getElementById(circleId);
    if (!circleDiv) {
      circleDiv = document.createElement('div');
      circleDiv.id = circleId;
      circleDiv.style.position = 'absolute';
      circleDiv.style.boxSizing = 'border-box';
      document.getElementById('amos-screen').appendChild(circleDiv);
      }
    circleDiv.style.borderRadius = '50%';
    circleDiv.style.border = '2px solid ' + Ink;
    circleDiv.style.left = (x*TILE_SIZE+12 - 8) + 'px';
    circleDiv.style.top = (y*TILE_SIZE+12 - 8) + 'px';
    circleDiv.style.width = (8 * 2) + 'px';
    circleDiv.style.height = (8 * 2) + 'px';
    circleDiv.style.zIndex = 10;
    circleDiv.style.backgroundColor = Ink; 
  }else {Ink = "rgb(0, 0, 170)";
    const idBar = "Bar_" + (x13) + "_" + (y13);
    const x1 = x13;
    const y1 = y13;
    const x2 = x23;
    const y2 = y23;
    const width = x2 - x1;
    const height = y2 - y1;

    let screenBarDiv = document.getElementById(idBar);

    if (!screenBarDiv) {
        screenBarDiv = document.createElement('div');
        screenBarDiv.id = idBar;
        screenBarDiv.style.position = 'absolute';
        screenBarDiv.style.boxSizing = 'border-box';
        document.getElementById('amos-screen').appendChild(screenBarDiv);
    }

    screenBarDiv.style.backgroundColor = Ink;
    screenBarDiv.style.left = x1 + 'px';
    screenBarDiv.style.top = y1 + 'px';
    screenBarDiv.style.width = width + 'px';
    screenBarDiv.style.height = height + 'px';
    screenBarDiv.style.zIndex = 10;
  
    const circleId = "Circle_" + (x*TILE_SIZE+12) + "_" + (y*TILE_SIZE+12) + "_" + (10);
    let circleDiv = document.getElementById(circleId);
    if (!circleDiv) {
      circleDiv = document.createElement('div');
      circleDiv.id = circleId;
      circleDiv.style.position = 'absolute';
      circleDiv.style.boxSizing = 'border-box';
      document.getElementById('amos-screen').appendChild(circleDiv);
      }
    circleDiv.style.borderRadius = '50%';
    circleDiv.style.border = '2px solid ' + Ink;
    circleDiv.style.left = (x*TILE_SIZE+12 - 10) + 'px';
    circleDiv.style.top = (y*TILE_SIZE+12 - 10) + 'px';
    circleDiv.style.width = (10 * 2) + 'px';
    circleDiv.style.height = (10 * 2) + 'px';
    circleDiv.style.zIndex = 10;
    circleDiv.style.backgroundColor = Ink; 
  
        }
             tileRendered = 1;
          
      }
    
      if (map[y][x] == 5) {
        
             renderPoints = 1;
          
    
        if (COLLECTED[y][x] == 1) {
        
               renderPoints = 0;
          
        }
    
        if (renderPoints == 1) {
        Ink = "rgb(0, 0, 170)";
    const idBar = "Bar_" + (x13) + "_" + (y13);
    const x1 = x13;
    const y1 = y13;
    const x2 = x23;
    const y2 = y23;
    const width = x2 - x1;
    const height = y2 - y1;

    let screenBarDiv = document.getElementById(idBar);

    if (!screenBarDiv) {
        screenBarDiv = document.createElement('div');
        screenBarDiv.id = idBar;
        screenBarDiv.style.position = 'absolute';
        screenBarDiv.style.boxSizing = 'border-box';
        document.getElementById('amos-screen').appendChild(screenBarDiv);
    }

    screenBarDiv.style.backgroundColor = Ink;
    screenBarDiv.style.left = x1 + 'px';
    screenBarDiv.style.top = y1 + 'px';
    screenBarDiv.style.width = width + 'px';
    screenBarDiv.style.height = height + 'px';
    screenBarDiv.style.zIndex = 10;
  
                  let RENDER_TYPE_FIVE_X = 0;
                  RENDER_TYPE_FIVE_X = x*TILE_SIZE+4;
          
                  let RENDER_TYPE_FIVE_Y = 0;
                  RENDER_TYPE_FIVE_Y = y*TILE_SIZE+4;
          
    renderSprite(4, RENDER_TYPE_FIVE_X, RENDER_TYPE_FIVE_Y, 27);
    }else {Ink = "rgb(0, 0, 170)";
    const idBar = "Bar_" + (x13) + "_" + (y13);
    const x1 = x13;
    const y1 = y13;
    const x2 = x23;
    const y2 = y23;
    const width = x2 - x1;
    const height = y2 - y1;

    let screenBarDiv = document.getElementById(idBar);

    if (!screenBarDiv) {
        screenBarDiv = document.createElement('div');
        screenBarDiv.id = idBar;
        screenBarDiv.style.position = 'absolute';
        screenBarDiv.style.boxSizing = 'border-box';
        document.getElementById('amos-screen').appendChild(screenBarDiv);
    }

    screenBarDiv.style.backgroundColor = Ink;
    screenBarDiv.style.left = x1 + 'px';
    screenBarDiv.style.top = y1 + 'px';
    screenBarDiv.style.width = width + 'px';
    screenBarDiv.style.height = height + 'px';
    screenBarDiv.style.zIndex = 10;
  
    const circleId = "Circle_" + (x*TILE_SIZE+12) + "_" + (y*TILE_SIZE+12) + "_" + (10);
    let circleDiv = document.getElementById(circleId);
    if (!circleDiv) {
      circleDiv = document.createElement('div');
      circleDiv.id = circleId;
      circleDiv.style.position = 'absolute';
      circleDiv.style.boxSizing = 'border-box';
      document.getElementById('amos-screen').appendChild(circleDiv);
      }
    circleDiv.style.borderRadius = '50%';
    circleDiv.style.border = '2px solid ' + Ink;
    circleDiv.style.left = (x*TILE_SIZE+12 - 10) + 'px';
    circleDiv.style.top = (y*TILE_SIZE+12 - 10) + 'px';
    circleDiv.style.width = (10 * 2) + 'px';
    circleDiv.style.height = (10 * 2) + 'px';
    circleDiv.style.zIndex = 10;
    circleDiv.style.backgroundColor = Ink; 
  
    renderSprite(4, 500, 750, 27);
    
        }
             tileRendered = 1;
          
      }
    
      if (map[y][x] == 6) {
        
             renderPoints = 1;
          
    
        if (COLLECTED[y][x] == 1) {
        
               renderPoints = 0;
          
        }
    
        if (renderPoints == 1) {
        Ink = "rgb(0, 0, 170)";
    const idBar = "Bar_" + (x13) + "_" + (y13);
    const x1 = x13;
    const y1 = y13;
    const x2 = x23;
    const y2 = y23;
    const width = x2 - x1;
    const height = y2 - y1;

    let screenBarDiv = document.getElementById(idBar);

    if (!screenBarDiv) {
        screenBarDiv = document.createElement('div');
        screenBarDiv.id = idBar;
        screenBarDiv.style.position = 'absolute';
        screenBarDiv.style.boxSizing = 'border-box';
        document.getElementById('amos-screen').appendChild(screenBarDiv);
    }

    screenBarDiv.style.backgroundColor = Ink;
    screenBarDiv.style.left = x1 + 'px';
    screenBarDiv.style.top = y1 + 'px';
    screenBarDiv.style.width = width + 'px';
    screenBarDiv.style.height = height + 'px';
    screenBarDiv.style.zIndex = 10;
  
                  let RENDER_TYPE_SIX_X = 0;
                  RENDER_TYPE_SIX_X = x*TILE_SIZE+4;
          
                  let RENDER_TYPE_SIX_Y = 0;
                  RENDER_TYPE_SIX_Y = y*TILE_SIZE+4;
          
    renderSprite(5, RENDER_TYPE_SIX_X, RENDER_TYPE_SIX_Y, 28);
    }else {Ink = "rgb(0, 0, 170)";
    const idBar = "Bar_" + (x13) + "_" + (y13);
    const x1 = x13;
    const y1 = y13;
    const x2 = x23;
    const y2 = y23;
    const width = x2 - x1;
    const height = y2 - y1;

    let screenBarDiv = document.getElementById(idBar);

    if (!screenBarDiv) {
        screenBarDiv = document.createElement('div');
        screenBarDiv.id = idBar;
        screenBarDiv.style.position = 'absolute';
        screenBarDiv.style.boxSizing = 'border-box';
        document.getElementById('amos-screen').appendChild(screenBarDiv);
    }

    screenBarDiv.style.backgroundColor = Ink;
    screenBarDiv.style.left = x1 + 'px';
    screenBarDiv.style.top = y1 + 'px';
    screenBarDiv.style.width = width + 'px';
    screenBarDiv.style.height = height + 'px';
    screenBarDiv.style.zIndex = 10;
  
    const circleId = "Circle_" + (x*TILE_SIZE+12) + "_" + (y*TILE_SIZE+12) + "_" + (10);
    let circleDiv = document.getElementById(circleId);
    if (!circleDiv) {
      circleDiv = document.createElement('div');
      circleDiv.id = circleId;
      circleDiv.style.position = 'absolute';
      circleDiv.style.boxSizing = 'border-box';
      document.getElementById('amos-screen').appendChild(circleDiv);
      }
    circleDiv.style.borderRadius = '50%';
    circleDiv.style.border = '2px solid ' + Ink;
    circleDiv.style.left = (x*TILE_SIZE+12 - 10) + 'px';
    circleDiv.style.top = (y*TILE_SIZE+12 - 10) + 'px';
    circleDiv.style.width = (10 * 2) + 'px';
    circleDiv.style.height = (10 * 2) + 'px';
    circleDiv.style.zIndex = 10;
    circleDiv.style.backgroundColor = Ink; 
  
    renderSprite(5, 520, 750, 28);
    
        }
             tileRendered = 1;
          
      }
    
      if (map[y][x] == 7) {
        
             renderPoints = 1;
          
    
        if (COLLECTED[y][x] == 1) {
        
               renderPoints = 0;
          
        }
    
        if (renderPoints == 1) {
        Ink = "rgb(0, 0, 170)";
    const idBar = "Bar_" + (x13) + "_" + (y13);
    const x1 = x13;
    const y1 = y13;
    const x2 = x23;
    const y2 = y23;
    const width = x2 - x1;
    const height = y2 - y1;

    let screenBarDiv = document.getElementById(idBar);

    if (!screenBarDiv) {
        screenBarDiv = document.createElement('div');
        screenBarDiv.id = idBar;
        screenBarDiv.style.position = 'absolute';
        screenBarDiv.style.boxSizing = 'border-box';
        document.getElementById('amos-screen').appendChild(screenBarDiv);
    }

    screenBarDiv.style.backgroundColor = Ink;
    screenBarDiv.style.left = x1 + 'px';
    screenBarDiv.style.top = y1 + 'px';
    screenBarDiv.style.width = width + 'px';
    screenBarDiv.style.height = height + 'px';
    screenBarDiv.style.zIndex = 10;
  
                  let RENDER_TYPE_SEVEN_X = 0;
                  RENDER_TYPE_SEVEN_X = x*TILE_SIZE+4;
          
                  let RENDER_TYPE_SEVEN_Y = 0;
                  RENDER_TYPE_SEVEN_Y = y*TILE_SIZE+4;
          
    renderSprite(6, RENDER_TYPE_SEVEN_X, RENDER_TYPE_SEVEN_Y, 29);
    }else {Ink = "rgb(0, 0, 170)";
    const idBar = "Bar_" + (x13) + "_" + (y13);
    const x1 = x13;
    const y1 = y13;
    const x2 = x23;
    const y2 = y23;
    const width = x2 - x1;
    const height = y2 - y1;

    let screenBarDiv = document.getElementById(idBar);

    if (!screenBarDiv) {
        screenBarDiv = document.createElement('div');
        screenBarDiv.id = idBar;
        screenBarDiv.style.position = 'absolute';
        screenBarDiv.style.boxSizing = 'border-box';
        document.getElementById('amos-screen').appendChild(screenBarDiv);
    }

    screenBarDiv.style.backgroundColor = Ink;
    screenBarDiv.style.left = x1 + 'px';
    screenBarDiv.style.top = y1 + 'px';
    screenBarDiv.style.width = width + 'px';
    screenBarDiv.style.height = height + 'px';
    screenBarDiv.style.zIndex = 10;
  
    const circleId = "Circle_" + (x*TILE_SIZE+12) + "_" + (y*TILE_SIZE+12) + "_" + (10);
    let circleDiv = document.getElementById(circleId);
    if (!circleDiv) {
      circleDiv = document.createElement('div');
      circleDiv.id = circleId;
      circleDiv.style.position = 'absolute';
      circleDiv.style.boxSizing = 'border-box';
      document.getElementById('amos-screen').appendChild(circleDiv);
      }
    circleDiv.style.borderRadius = '50%';
    circleDiv.style.border = '2px solid ' + Ink;
    circleDiv.style.left = (x*TILE_SIZE+12 - 10) + 'px';
    circleDiv.style.top = (y*TILE_SIZE+12 - 10) + 'px';
    circleDiv.style.width = (10 * 2) + 'px';
    circleDiv.style.height = (10 * 2) + 'px';
    circleDiv.style.zIndex = 10;
    circleDiv.style.backgroundColor = Ink; 
  
    renderSprite(6, 540, 750, 29);
    
        }
             tileRendered = 1;
          
      }
    
      if (map[y][x] == 8) {
        
             renderPoints = 1;
          
    
        if (COLLECTED[y][x] == 1) {
        
               renderPoints = 0;
          
        }
    
        if (renderPoints == 1) {
        Ink = "rgb(0, 0, 170)";
    const idBar = "Bar_" + (x13) + "_" + (y13);
    const x1 = x13;
    const y1 = y13;
    const x2 = x23;
    const y2 = y23;
    const width = x2 - x1;
    const height = y2 - y1;

    let screenBarDiv = document.getElementById(idBar);

    if (!screenBarDiv) {
        screenBarDiv = document.createElement('div');
        screenBarDiv.id = idBar;
        screenBarDiv.style.position = 'absolute';
        screenBarDiv.style.boxSizing = 'border-box';
        document.getElementById('amos-screen').appendChild(screenBarDiv);
    }

    screenBarDiv.style.backgroundColor = Ink;
    screenBarDiv.style.left = x1 + 'px';
    screenBarDiv.style.top = y1 + 'px';
    screenBarDiv.style.width = width + 'px';
    screenBarDiv.style.height = height + 'px';
    screenBarDiv.style.zIndex = 10;
  
                  let RENDER_TYPE_EIGHT_X = 0;
                  RENDER_TYPE_EIGHT_X = x*TILE_SIZE+4;
          
                  let RENDER_TYPE_EIGHT_Y = 0;
                  RENDER_TYPE_EIGHT_Y = y*TILE_SIZE+4;
          
    renderSprite(7, RENDER_TYPE_EIGHT_X, RENDER_TYPE_EIGHT_Y, 30);
    }else {Ink = "rgb(0, 0, 170)";
    const idBar = "Bar_" + (x13) + "_" + (y13);
    const x1 = x13;
    const y1 = y13;
    const x2 = x23;
    const y2 = y23;
    const width = x2 - x1;
    const height = y2 - y1;

    let screenBarDiv = document.getElementById(idBar);

    if (!screenBarDiv) {
        screenBarDiv = document.createElement('div');
        screenBarDiv.id = idBar;
        screenBarDiv.style.position = 'absolute';
        screenBarDiv.style.boxSizing = 'border-box';
        document.getElementById('amos-screen').appendChild(screenBarDiv);
    }

    screenBarDiv.style.backgroundColor = Ink;
    screenBarDiv.style.left = x1 + 'px';
    screenBarDiv.style.top = y1 + 'px';
    screenBarDiv.style.width = width + 'px';
    screenBarDiv.style.height = height + 'px';
    screenBarDiv.style.zIndex = 10;
  
    const circleId = "Circle_" + (x*TILE_SIZE+12) + "_" + (y*TILE_SIZE+12) + "_" + (10);
    let circleDiv = document.getElementById(circleId);
    if (!circleDiv) {
      circleDiv = document.createElement('div');
      circleDiv.id = circleId;
      circleDiv.style.position = 'absolute';
      circleDiv.style.boxSizing = 'border-box';
      document.getElementById('amos-screen').appendChild(circleDiv);
      }
    circleDiv.style.borderRadius = '50%';
    circleDiv.style.border = '2px solid ' + Ink;
    circleDiv.style.left = (x*TILE_SIZE+12 - 10) + 'px';
    circleDiv.style.top = (y*TILE_SIZE+12 - 10) + 'px';
    circleDiv.style.width = (10 * 2) + 'px';
    circleDiv.style.height = (10 * 2) + 'px';
    circleDiv.style.zIndex = 10;
    circleDiv.style.backgroundColor = Ink; 
  
    renderSprite(7, 560, 750, 30);
    
        }
             tileRendered = 1;
          
      }
    
      if (tileRendered == 0) {
        Ink = "rgb(0, 0, 170)";
    const idBar = "Bar_" + (x13) + "_" + (y13);
    const x1 = x13;
    const y1 = y13;
    const x2 = x23;
    const y2 = y23;
    const width = x2 - x1;
    const height = y2 - y1;

    let screenBarDiv = document.getElementById(idBar);

    if (!screenBarDiv) {
        screenBarDiv = document.createElement('div');
        screenBarDiv.id = idBar;
        screenBarDiv.style.position = 'absolute';
        screenBarDiv.style.boxSizing = 'border-box';
        document.getElementById('amos-screen').appendChild(screenBarDiv);
    }

    screenBarDiv.style.backgroundColor = Ink;
    screenBarDiv.style.left = x1 + 'px';
    screenBarDiv.style.top = y1 + 'px';
    screenBarDiv.style.width = width + 'px';
    screenBarDiv.style.height = height + 'px';
    screenBarDiv.style.zIndex = 10;
  
    const circleId = "Circle_" + (x*TILE_SIZE+12) + "_" + (y*TILE_SIZE+12) + "_" + (10);
    let circleDiv = document.getElementById(circleId);
    if (!circleDiv) {
      circleDiv = document.createElement('div');
      circleDiv.id = circleId;
      circleDiv.style.position = 'absolute';
      circleDiv.style.boxSizing = 'border-box';
      document.getElementById('amos-screen').appendChild(circleDiv);
      }
    circleDiv.style.borderRadius = '50%';
    circleDiv.style.border = '2px solid ' + Ink;
    circleDiv.style.left = (x*TILE_SIZE+12 - 10) + 'px';
    circleDiv.style.top = (y*TILE_SIZE+12 - 10) + 'px';
    circleDiv.style.width = (10 * 2) + 'px';
    circleDiv.style.height = (10 * 2) + 'px';
    circleDiv.style.zIndex = 10;
    circleDiv.style.backgroundColor = Ink; 
  
      }
    
      if (x == PX) {
        Ink = "rgb(255, 255, 0)";
    
        if (y == PY) {
        
                  let pacspritex = 0;
                  pacspritex = PX*TILE_SIZE+4;
          
                  let pacspritey = 0;
                  pacspritey = PY*TILE_SIZE+4;
          
    renderSprite(1, pacspritex, pacspritey, PACMAN_CURRENT_SPRITE);
    
        }
      }
    
      if (x == P_GHOST_ONE_X) {
        Ink = "rgb(187, 187, 187)";
    
        if (y == P_GHOST_ONE_Y) {
        
                  let ghostspriteonex = 0;
                  ghostspriteonex = P_GHOST_ONE_X*TILE_SIZE+4;
          
                  let ghostspriteoney = 0;
                  ghostspriteoney = P_GHOST_ONE_Y*TILE_SIZE+4;
          
    
          if (POWER_PELLET > 0) {
        
    renderSprite(2, ghostspriteonex, ghostspriteoney, 26);
    }else {
    renderSprite(2, ghostspriteonex, ghostspriteoney, 25);
    
          }
        }
      }
    
      if (x == P_GHOST_TWO_X) {
        Ink = "rgb(170, 170, 170)";
    
        if (y == P_GHOST_TWO_Y) {
        
                  let ghostspritetwox = 0;
                  ghostspritetwox = P_GHOST_TWO_X*TILE_SIZE+4;
          
                  let ghostspritetwoy = 0;
                  ghostspritetwoy = P_GHOST_TWO_Y*TILE_SIZE+4;
          
    
          if (POWER_PELLET > 0) {
        
    renderSprite(3, ghostspritetwox, ghostspritetwoy, 26);
    }else {
    renderSprite(3, ghostspritetwox, ghostspritetwoy, 24);
    
          }
        }
      }    }  }
    
  if (PLAYER_DIED == 1) {
        
    
    if (AlreaDYDied == 0) {
        Ink = "rgb(255, 255, 0)";
      const textDiv1010 = document.createElement('div');
      textDiv1010.innerText = 'You Died!';
      textDiv1010.id = 'textDiv' + '10' + '10';
      textDiv1010.style.position = 'absolute';
      textDiv1010.style.left = '10px';
      textDiv1010.style.top = '10px';
      textDiv1010.style.fontSize = '14px';
      textDiv1010.style.color = Ink;
      textDiv1010.style.position = "Relative";
      textDiv1010.style.zIndex = 99;
      document.getElementById('amos-screen').appendChild(textDiv1010);
        
           AlreaDYDied = 1;
          
    }
  }
}
Ink = "rgb(255, 255, 0)";
        
const textDiv430820 = document.createElement('div');
textDiv430820.innerText = CURRENT_GHOST_TIMER;
textDiv430820.id = 'textDiv' + '430' + '820';
textDiv430820.style.position = 'fixed';
textDiv430820.style.left = '430px';
textDiv430820.style.top = '820px';
textDiv430820.style.fontSize = '14px';
textDiv430820.style.color = Ink;

textDiv430820.style.zIndex = 99;
document.getElementById('amos-screen').appendChild(textDiv430820);
      setInterval(() => {
  textDiv430820.innerText = CURRENT_GHOST_TIMER; // Function that returns updated value
}, 100); 
        
const textDiv130740 = document.createElement('div');
textDiv130740.innerText = 'Ghost movement timer:';
textDiv130740.id = 'textDiv' + '130' + '740';
textDiv130740.style.position = 'absolute';
textDiv130740.style.left = '130px';
textDiv130740.style.top = '740px';
textDiv130740.style.fontSize = '14px';
textDiv130740.style.color = Ink;
textDiv130740.style.position = "Relative";
textDiv130740.style.zIndex = 99;
document.getElementById('amos-screen').appendChild(textDiv130740);
        
const textDiv400654 = document.createElement('div');
textDiv400654.innerText = 'Fruits:';
textDiv400654.id = 'textDiv' + '400' + '654';
textDiv400654.style.position = 'absolute';
textDiv400654.style.left = '400px';
textDiv400654.style.top = '654px';
textDiv400654.style.fontSize = '14px';
textDiv400654.style.color = Ink;
textDiv400654.style.position = "Relative";
textDiv400654.style.zIndex = 99;
document.getElementById('amos-screen').appendChild(textDiv400654);
        
let allowLoop = true; // Controla o loop para Wait funcionar

setInterval(() => {
  if (!allowLoop) return;

  currentTimer = Date.now();
  Timer++;

  P_DRAWMAP(1);

    
  if (POWER_PELLET > 0) {
        Ink = "rgb(255, 255, 0)";
    const idBar = "Bar_" + (10) + "_" + (745);
    const x1 = 10;
    const y1 = 745;
    const x2 = POWER_PELLET;
    const y2 = 775;
    const width = x2 - x1;
    const height = y2 - y1;

    let screenBarDiv = document.getElementById(idBar);

    if (!screenBarDiv) {
        screenBarDiv = document.createElement('div');
        screenBarDiv.id = idBar;
        screenBarDiv.style.position = 'absolute';
        screenBarDiv.style.boxSizing = 'border-box';
        document.getElementById('amos-screen').appendChild(screenBarDiv);
    }

    screenBarDiv.style.backgroundColor = Ink;
    screenBarDiv.style.left = x1 + 'px';
    screenBarDiv.style.top = y1 + 'px';
    screenBarDiv.style.width = width + 'px';
    screenBarDiv.style.height = height + 'px';
    screenBarDiv.style.zIndex = 10;
  
         POWER_PELLET = POWER_PELLET-5;
          
    
    if (POWER_PELLET < 0) {
        
           POWER_PELLET = 0;
          
    }}else {Ink = "rgb(0, 0, 170)";
    const idBar = "Bar_" + (10) + "_" + (745);
    const x1 = 10;
    const y1 = 745;
    const x2 = 200;
    const y2 = 775;
    const width = x2 - x1;
    const height = y2 - y1;

    let screenBarDiv = document.getElementById(idBar);

    if (!screenBarDiv) {
        screenBarDiv = document.createElement('div');
        screenBarDiv.id = idBar;
        screenBarDiv.style.position = 'absolute';
        screenBarDiv.style.boxSizing = 'border-box';
        document.getElementById('amos-screen').appendChild(screenBarDiv);
    }

    screenBarDiv.style.backgroundColor = Ink;
    screenBarDiv.style.left = x1 + 'px';
    screenBarDiv.style.top = y1 + 'px';
    screenBarDiv.style.width = width + 'px';
    screenBarDiv.style.height = height + 'px';
    screenBarDiv.style.zIndex = 10;
  
  }
          NX = PX;
          
          NY = PY;
          
    
  if (PLAYER_DIED == 0) {
        
    
    if (currentPressedKey === keyMapping[17]) {
   

  
           NY = PY-1;
          
           PACMAN_DIRECTION = 2;
          
    
}
    
    if (currentPressedKey === keyMapping[31]) {
   

  
           NY = PY+1;
          
           PACMAN_DIRECTION = 3;
          
    
}
    
    if (currentPressedKey === keyMapping[30]) {
   

  
           NX = PX-1;
          
           PACMAN_DIRECTION = 1;
          
    
}
    
    if (currentPressedKey === keyMapping[32]) {
   

  
           NX = PX+1;
          
           PACMAN_DIRECTION = 0;
          
    
}
  }
    
  if (map[NY][NX] == 0) {
        
         PX = NX;
          
         PY = NY;
          
  }
    
  if (PACMAN_DIRECTION == 0) {
        
         PACMAN_CURRENT_SPRITE = PACMAN_CURRENT_SPRITE+1;
          
    
    if (PACMAN_CURRENT_SPRITE > 5) {
        
           PACMAN_CURRENT_SPRITE = 1;
          
    }
  }
    
  if (PACMAN_DIRECTION == 1) {
        
         PACMAN_CURRENT_SPRITE = PACMAN_CURRENT_SPRITE+1;
          
    
    if (PACMAN_CURRENT_SPRITE > 11) {
        
           PACMAN_CURRENT_SPRITE = 6;
          
    }
  }
    
  if (PACMAN_DIRECTION == 2) {
        
         PACMAN_CURRENT_SPRITE = PACMAN_CURRENT_SPRITE+1;
          
    
    if (PACMAN_CURRENT_SPRITE > 17) {
        
           PACMAN_CURRENT_SPRITE = 12;
          
    }
  }
    
  if (PACMAN_DIRECTION == 3) {
        
         PACMAN_CURRENT_SPRITE = PACMAN_CURRENT_SPRITE+1;
          
    
    if (PACMAN_CURRENT_SPRITE > 23) {
        
           PACMAN_CURRENT_SPRITE = 18;
          
    }
  }
    
  if (map[NY][NX] == 3) {
        
         PX = NX;
          
         PY = NY;
          
    
    if (COLLECTED[PY][PX] == 0) {
              COLLECTED[PY][PX] = 1;

           points = points+10;
          
    }
  }
    
  if (map[NY][NX] == 4) {
        
         PX = NX;
          
         PY = NY;
          
    
    if (COLLECTED[PY][PX] == 0) {
              COLLECTED[PY][PX] = 1;

           points = points+50;
          
           POWER_PELLET = 200;
          
    }
  }
    
  if (map[NY][NX] == 5) {
        
         PX = NX;
          
         PY = NY;
          
    
    if (COLLECTED[PY][PX] == 0) {
              COLLECTED[PY][PX] = 1;

           points = points+200;
          
    }
  }
    
  if (map[NY][NX] == 6) {
        
         PX = NX;
          
         PY = NY;
          
    
    if (COLLECTED[PY][PX] == 0) {
              COLLECTED[PY][PX] = 1;

           points = points+400;
          
    }
  }
    
  if (map[NY][NX] == 7) {
        
         PX = NX;
          
         PY = NY;
          
    
    if (COLLECTED[PY][PX] == 0) {
              COLLECTED[PY][PX] = 1;

           points = points+450;
          
    }
  }
    
  if (map[NY][NX] == 8) {
        
         PX = NX;
          
         PY = NY;
          
    
    if (COLLECTED[PY][PX] == 0) {
              COLLECTED[PY][PX] = 1;

           points = points+500;
          
    }
  }
    
  if (PACMAN_DIRECTION == 0) {
        
    
    if (PACMAN_DIRECTION != PACMAN_TURN_TO_DIRECTION) {
        
           PACMAN_CURRENT_SPRITE = 1;
          
           PACMAN_TURN_TO_DIRECTION = 0;
          
    }
  }
    
  if (PACMAN_DIRECTION == 1) {
        
    
    if (PACMAN_DIRECTION != PACMAN_TURN_TO_DIRECTION) {
        
           PACMAN_CURRENT_SPRITE = 6;
          
           PACMAN_TURN_TO_DIRECTION = 1;
          
    }
  }
    
  if (PACMAN_DIRECTION == 2) {
        
    
    if (PACMAN_DIRECTION != PACMAN_TURN_TO_DIRECTION) {
        
           PACMAN_CURRENT_SPRITE = 11;
          
           PACMAN_TURN_TO_DIRECTION = 2;
          
    }
  }
    
  if (PACMAN_DIRECTION == 3) {
        
    
    if (PACMAN_DIRECTION != PACMAN_TURN_TO_DIRECTION) {
        
           PACMAN_CURRENT_SPRITE = 17;
          
           PACMAN_TURN_TO_DIRECTION = 3;
          
    }
  }
    
  if (PY == 14) {
        
    
    if (PX == 0) {
        
    
      if (PACMAN_DIRECTION == 1) {
        
             PX = 27;
          
      }
    }
    
    if (PX == 27) {
        
    
      if (PACMAN_DIRECTION == 0) {
        
             PX = 0;
          
      }
    }
  }
    
  if (CURRENT_GHOST_TIMER == 0) {
        
    MoveGhosts(1);

         CURRENT_GHOST_TIMER = GHOST_TIMER;
          }else {
           CURRENT_GHOST_TIMER = CURRENT_GHOST_TIMER-1;
          
  }
  allowLoop = false;
  setTimeout(() => {
  allowLoop = true;
  }, 240);

    
    
    Timer = 9;
  
}, 16); 

