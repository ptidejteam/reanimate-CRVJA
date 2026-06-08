# CRVJA Sprite Tutorial: Working with Retro Assets & Creating a Game

Welcome to the CRVJA Sprite Tutorial! This guide is designed for beginners who want to learn how to create, load, and animate **sprites** using CRVJA (an Amiga AMOS BASIC transpiler and emulator running in the browser).

By the end of this tutorial, you will understand how sprites work under the hood, how to use the built-in Bank Editor to design your own graphics, and how to write a simple AMOS BASIC game from scratch!

---

## 1. What are Sprites?

In retro game development (specifically on the Commodore Amiga), **sprites** are graphics that can move around the screen independently of the background. They are ideal for players, enemies, items, and projectiles.

In CRVJA, sprites are managed through **Sprite Banks** (binary files with the `.abk` extension, short for Amiga Bank). A sprite bank contains:
1. **Planar Pixel Data**: The raw graphics frames.
2. **Hotspots**: The anchor/origin point (X, Y) of the sprite for positioning and rotation.
3. **Color Palette**: An array of 32 colors.
   * **Note on Transparency**: In AMOS, **Palette Index 0** is always reserved for transparency. Any pixel painted with the first color in the palette will be invisible in the game.

### Technical Concept: Bitplanes and Planar Data
Unlike modern images (PNG/JPG) which store red, green, and blue values for each pixel sequentially (chunky format), the Amiga stores graphics in **bitplanes** (planar format). 

For a sprite with a color **depth of 4** (which means 4 bitplanes), each pixel's color is defined by a 4-bit index (supporting $2^4 = 16$ colors). To determine a pixel's color, CRVJA reads 1 bit from each of the 4 planes and combines them (using bitwise OR operations) to get a number between 0 and 15, which is then mapped to the 32-color palette. 

---

## 2. Using the Built-in Bank Editor (Sprite Editor)

CRVJA includes a built-in sprite editor so you can draw your sprites directly in your browser.

### How to Open the Editor
1. Open the CRVJA Workbench interface in your browser (usually at `http://localhost:3000/`).
2. Double-click the **Sprites** icon on the desktop. This opens the **Bank Editor** window.

### Anatomy of the Bank Editor

```
+-----------------------------------------------------------+
| [GENERATE BANK FILE]                                      |
|                                                           |
|  (Left Column)      (Middle Column)       (Right Column)  |
|  PALETTE            PIXEL EDITOR          SPRITES BANK    |
|  +------------+     +---------------+     +-------------+ |
|  | Color 0 (T)|     | Width:  [1]   |     | [Duplicate] | |
|  | Color 1    |     | Height: [16]  |     | [Add New]   | |
|  | Color 2    |     |               |     | [Clear Bank]| |
|  | ...        |     | [Save] [Del]  |     |             | |
|  | Color 31   |     |               |     | Sprite List | |
|  +------------+     |  Grid Canvas  |     | [S0] [S1]   | |
|                     |  to draw...   |     |             | |
|                     +---------------+     +-------------+ |
+-----------------------------------------------------------+
```

#### A. The Palette (Left Column)
* **Select active color**: Left-click any color box to set it as your current drawing color.
* **Edit a color**: Right-click a color box to open a color picker. Pick a new color and click **Close** to update the palette.
* **Transparency**: Remember, the first color box (Index 0) is transparent in the game.

#### B. The Pixel Editor (Middle Column)
* **Width and Height**: Set the dimensions of the selected sprite frame.
  * *Important*: In AMOS, sprite width is measured in **16-bit words** (units of 16 pixels). A width of `1` means 16 pixels; `2` means 32 pixels. Height is measured in actual pixels (e.g., `16`, `24`).
* **Canvas Grid**: Left-click or click-and-drag across the grid to paint pixels.
* **Save/Delete**: Click **Save** to apply your changes to the active frame, or **Delete** to delete it.

#### C. Sprites Bank (Right Column)
* **Add New Sprite**: Creates a blank sprite frame (default 16x16 pixels).
* **Duplicate Sprite selected**: Clones the active sprite. This is extremely useful for drawing running or spinning animations frame-by-frame.
* **Clear Bank**: Resets all sprites and clears the palette.
* **Save Bank to Local Storage**: Saves your work to the browser's storage so you don't lose it if you refresh the page.
* **Load Bank**: Lets you select and load an existing `.abk` file from your computer.

### Exporting Your Sprites
Once you are done drawing, click the **GENERATE BANK FILE** button at the top-left of the editor. This compiles your sprites into a binary `.abk` file (e.g., `AmosBank_test4.abk`) and downloads it to your computer.

---

## 3. Loading and Drawing Sprites in AMOS Code

To use your sprites in a game, you must write code in the CRVJA code editor.

### Step 1: Assign the Sprite Bank to a Slot
1. At the bottom of the CRVJA code editor, locate the **Bank Manager** panel.
2. Select **Bank 1**'s file input and upload your `.abk` file. The sandbox will now make this file available to your code.

### Step 2: Write the Loading Code
To load the sprites into memory in your program, use the `Load` command:

```amos
Load "sprites.abk"
```
*Note: By default, this loads the bank into Bank Slot 1. If you need to specify a slot, you can append it: `Load "sprites.abk", 1`.*

### Step 3: Draw a Sprite Frame on Screen
To render a sprite on the screen, use the `Sprite` command:

```amos
Sprite SpriteID, X, Y, BankIndex
```
* **`SpriteID`**: A unique number (e.g., `1`, `2`, `3`) representing this sprite instance on screen. 
* **`X`**: The horizontal position on screen (in pixels).
* **`Y`**: The vertical position on screen (in pixels).
* **`BankIndex`**: The index of the frame inside your `.abk` file (0-based: `0` is the first sprite, `1` is the second, etc.).

For example, to draw sprite ID `1` at coordinates `100, 150` using the first frame of your bank:
```amos
Sprite 1, 100, 150, 0
```

---

## 4. Game Tutorial: Creating "Catch the Cherry"

Let's write a complete, playable video game! In this game, you control a character (Sprite ID 1) and try to collect a cherry (Sprite ID 2) that spawns randomly. Every time you catch it, your score increases and a sound plays.

### Step 1: Draw Your Sprites
Open the **Sprites Editor** (Bank Editor) and create a bank with two sprites:
1. **Frame 0 (Player)**: Draw a character (e.g., a yellow circle, a space invader, or a face).
2. **Frame 1 (Cherry)**: Click **Add New Sprite** and draw a cherry (e.g., red pixels with a green stem).
3. **Palette**: Ensure you have some vibrant colors set.
4. Click **GENERATE BANK FILE** and rename the downloaded file to `game.abk`.

### Step 2: Upload `game.abk`
In the CRVJA editor under **Bank 1**, select your `game.abk` file.

### Step 3: Write the Code
Copy and paste the following AMOS BASIC code into the CRVJA code editor:

```amos
Screen Open 1, 600, 400, 8, Hires
Curs Off
Paper 0 : Cls

' 2. Load Visual Assets
Load "game.abk"

' 3. Initialize Variables
PLAYER_X = 100
PLAYER_Y = 150
PLAYER_SPEED = 6

' Spawn the Cherry
CHERRY_X = 300
CHERRY_Y = 200

SCORE = 0

' 4. Main Game Loop
Do
   ' Redraw HUD (Score)
   
   ' Read Keyboard Controls (W/S/A/D or Arrow Keys)
   ' A Key ($1E) or Left Arrow ($70)
   If Key State($1E)
      PLAYER_X = PLAYER_X - PLAYER_SPEED
   End If
   If Key State($70)
      PLAYER_X = PLAYER_X - PLAYER_SPEED
   End If

   ' D Key ($20) or Right Arrow ($71)
   If Key State($20)
      PLAYER_X = PLAYER_X + PLAYER_SPEED
   End If
   If Key State($71)
      PLAYER_X = PLAYER_X + PLAYER_SPEED
   End If

   ' W Key ($11) or Up Arrow ($6E)
   If Key State($11)
      PLAYER_Y = PLAYER_Y - PLAYER_SPEED
   End If
   If Key State($6E)
      PLAYER_Y = PLAYER_Y - PLAYER_SPEED
   End If

   ' S Key ($1F) or Down Arrow ($73)
   If Key State($1F)
      PLAYER_Y = PLAYER_Y + PLAYER_SPEED
   End If
   If Key State($73)
      PLAYER_Y = PLAYER_Y + PLAYER_SPEED
   End If
   
   ' Clamp Player to Screen Boundary (assuming 16x16 sprite size)
   If PLAYER_X < 10
      PLAYER_X = 10
   End If
   If PLAYER_X > 570
      PLAYER_X = 570
   End If
   If PLAYER_Y < 30
      PLAYER_Y = 30
   End If
   If PLAYER_Y > 370
      PLAYER_Y = 370
   End If
   
   ' 5. Draw Sprites on Screen
   ' Draw Player (Sprite ID 1, using frame 0)
   Sprite 1, PLAYER_X, PLAYER_Y, 0
   
   ' Draw Cherry (Sprite ID 2, using frame 1)
   Sprite 2, CHERRY_X, CHERRY_Y, 1
   
   ' 6. Collision Detection (Bounding Box)
   ' Calculate absolute distances in X and Y coordinates
   DIST_X = PLAYER_X - CHERRY_X
   If DIST_X < 0
      DIST_X = 0 - DIST_X
   End If
   
   DIST_Y = PLAYER_Y - CHERRY_Y
   If DIST_Y < 0
      DIST_Y = 0 - DIST_Y
   End If
   
   ' Check if player and cherry overlap (within 16 pixels)
   If DIST_X < 16
      If DIST_Y < 16
         ' Collision! Earn points and relocate Cherry
         SCORE = SCORE + 10
         CHERRY_X = 50 + Rnd(500)
         CHERRY_Y = 50 + Rnd(300)
         
         ' Play note 37 (middle C area) for 1 second as sound effect
         Play 37, 1
         
         ' Clean previous score text by clearing HUD area
         Cls 0, 10, 5 To 200, 25
      End If
   End If
   
   ' 7. Control Frame Rate (Ticks)
   ' Wait 2 ticks (~40ms) to keep controls responsive and smooth
   Wait 2
Loop
```

### Step 4: Run the Game!
Click the **Run code** button. Use the arrow keys or **W, A, S, D** to move your character. Go catch that cherry and see your score rise!

---

## 5. Important Tips & Troubleshooting

To save you from debugging headaches, keep these CRVJA transpiler behaviors in mind:

1. **How to Hide a Sprite (Workaround for `Sprite Off`)**:
   In official AMOS, you can hide a sprite using `Sprite Off`. In CRVJA, calling `Sprite Off` can cause an execution crash. 
   * **Workaround**: To hide a sprite, simply draw it off-screen, such as:
     ```amos
     Sprite 1, -100, -100, 0
     ```
2. **Variable String Assignments Limitation**:
   Assigning non-empty string literals to variables (e.g., `NAME$ = "Player"`) is currently syntactically invalid in the CRVJA parser. Always pass strings directly into commands (like `Text 10, 20, "SCORE:"`).
3. **No Unary Minus Reassignment**:
   Assigning a negative value to a variable using a unary operator (e.g. `X = -X`) may fail parsing. Use standard subtraction instead: `X = 0 - X`.
4. **Key mapping scan codes**:
   If you want to use other keys, you can refer to the following raw code list:
   * **W, A, S, D**: `$11`, `$1E`, `$1F`, `$20`
   * **Up, Left, Right, Down Arrows**: `$6E`, `$70`, `$71`, `$73`
   * **Space**: `$39`
   * **Escape**: `$1`
   * **Enter**: `$1C` (Note: standard numpad enter is `$67`)
