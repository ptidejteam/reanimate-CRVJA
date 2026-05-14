# CRVJA Tutorial: Creating Your First Visual Programs

Welcome to CRVJA! This tutorial is designed for beginners who want to learn how to create simple visual programs and games using AMOS, a programming language originally created for the Amiga computer and now brought to the modern web.

In this tutorial, you will learn the basics of setting up a screen, changing colors, printing text, and drawing shapes. You can test all the code examples by running CRVJA in your browser (usually at `https://crvja.reanimate.school/`), typing the code into the editor, and clicking "Run code".

---

## 1. Setting up the Screen

Before we can draw anything, we need to create a canvas (or screen) to draw on. In AMOS, we do this using the `Screen Open` command.

Here is the simplest way to start a program:

```amos
Screen Open 1, 600, 400, 8, Hires
```

**What does this mean?**
- `1`: The ID of the screen. We use `1` for our main screen.
- `600, 400`: The width and height of the screen in pixels. Here, our screen is 600 pixels wide and 400 pixels tall.
- `8`: The number of colors we want to be able to use.
- `Hires`: High resolution mode.

To prevent the text cursor from blinking on the screen and distracting us, we usually add the `Curs Off` command right after opening the screen:

```amos
Screen Open 1, 600, 400, 8, Hires
Curs Off
```

---

## 2. Changing the Background Color

By default, the screen might look plain. Let's make it black! 
We use the `Paper` command to select a background color, and the `Cls` (Clear Screen) command to paint the entire screen with that color.

```amos
Screen Open 1, 600, 400, 8, Hires
Curs Off

' Set the background color to 0 (which is black) and clear the screen
Paper 0
Cls
```

*Note: In AMOS, lines starting with an apostrophe `'` are comments. They are ignored by the computer and are just there to help humans understand the code.*

---

## 3. Printing Text on the Screen

Now that we have a nice black screen, let's write something on it! We can use the `Text` command to place words anywhere on the screen. 

First, we need to pick a color for our text using the `Ink` command. Colors are represented by numbers (for example, `1`, `2`, `3`).

```amos
Screen Open 1, 600, 400, 8, Hires
Curs Off
Paper 0
Cls

' Pick color #2 for our text
Ink 2

' Write "Hello World!" at X=10, Y=20
Text 10, 20, "Hello World!"
```

**How coordinates work (X and Y):**
- **X (10)**: How far from the left edge of the screen.
- **Y (20)**: How far from the top edge of the screen.

---

## 4. Drawing Shapes: A Simple Circle

Drawing shapes is just as easy as writing text. Let's draw a circle. We will use the `Circle` command, which needs three pieces of information: the X position, the Y position, and the radius (how big the circle is).

```amos
Screen Open 1, 600, 400, 8, Hires
Curs Off
Paper 0
Cls

' Pick color #3 for our circle
Ink 3

' Draw a circle at X=300, Y=200, with a radius of 50
Circle 300, 200, 50
```

Since our screen is 600 pixels wide and 400 pixels tall, placing the circle at X=300 and Y=200 puts it right in the middle!

---

## 5. Putting It All Together

Let's combine everything we've learned into one complete program that sets up a screen, paints it black, writes a title, and draws a few circles.

```amos
' 1. Setup the screen
Screen Open 1, 600, 400, 8, Hires
Curs Off

' 2. Paint the background black
Paper 0
Cls

' 3. Write a title
Ink 2
Text 200, 30, "My First CRVJA Program!"

' 4. Draw a big circle in the middle
Ink 3
Circle 300, 200, 80

' 5. Draw two smaller circles
Ink 4
Circle 250, 180, 20
Circle 350, 180, 20
```

Copy and paste this code into CRVJA and hit "Run code" to see your creation!

---

## What's Next?

Congratulations! You have just created your first visual programs using AMOS in CRVJA. Here are a few things you can try to experiment:
- Change the `X` and `Y` numbers in the `Circle` and `Text` commands to move things around.
- Change the `Ink` numbers to see what other colors you can find.
- Change the radius in the `Circle` command to make circles bigger or smaller.

As you get more comfortable, you can start looking at loops (`Do ... Loop`), logic (`If ... End If`), and drawing rectangles (`Bar X1, Y1 To X2, Y2`) to start building more complex scenes and eventually simple games!
