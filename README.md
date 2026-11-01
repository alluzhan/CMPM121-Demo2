# Garden Sketchpad 🌸

## User Documentation

Deployed Page:
[Sketch Pad Demo 2](https://alluzhan.github.io/CMPM121-Demo2/)

### Tools

- Thin and thick markers
- Three preset stickers: 🌸 🌿 🪷
- Create custom sticker (up to three)
- Undo/redo button
- Redraw/clear button
- Export drawings as high-resolution PNG images

### How to Use

- Markers: Choose thin or thick, then drag on canvas to draw.
- Stickers: Select a sticker and click on canvas to place it.
- Buttons:
  - Undo/Redo: Allow multi-step navigate drawing history.
  - Clear: Deleted the drawing and its history, not recoverable.
  - Redraw: deleted the pixels and reconstruct canvas from saved commands.
  - Add New sticker: Click to create a new sticker tool.
  - Export PNG: download a png image of your canvas to local. The png is 2x the canvas size at 1000 x 1000 with an opaque white background.

### Canceling a Stroke

- Escape key: Releasing the mouse pointer outside of the canvas completes the drawing stroke, clicking escape while still drawing the stroke within the canvas discards the stroke.

### Run Locally

Requirements:

- Deno
- Git
- Network Requirements: Internet access is required for the initial setup and dependency downloads. After that it is run locally with no network requirements.

1. Clone the repository:

```shell
git clone https://github.com/alluzhan/CMPM121-Demo2.git
cd CMPM121-Demo2
```

2. Install dependencies:

```shell
deno task setup
```

3. Start the development server:

```shell
deno task dev
```

4. To check and build the product, and then preview it:

```shell
deno task ci
deno task preview
```

## Developer Documentation

- [`src/tools.ts`](src/tools.ts): The list of tools (markers and stickers). Built-in and user-made stickers live in the same list.
- [`src/drawing.ts`](src/drawing.ts): Command types (`Stroke`, `Sticker`) for drawing or adding a sticker, and `drawCommand(ctx, command)`, which draws any command onto the canvas.
- [`src/history.ts`](src/history.ts): Keeps the saved marks and handles undo, redo, and clear (`addCommand`, `undo`, `redo`, `clearHistory`).
- [`src/render.ts`](src/render.ts): `renderScene(ctx, commands, scale)` clears the canvas, adds a white background, then draws every saved stroke in order. Used by display and export.
- [`src/export.ts`](src/export.ts): Makes a hidden canvas, paints the picture on it, and downloads it as a PNG with `renderScene`.
- [`src/main.ts`](src/main.ts): Handles the mouse, the selected tool, the buttons, and the line you are currently drawing.

### Implementing a new tool: Circle Tool

1. To create a new Circle tool in `src/tools.ts`: add `{ type: "circle"; width: number }` to the `Tool` union and a preset in `tools`.
2. Add a command in `src/drawing.ts`: add a `Circle` type (center, radius,
   color, width) and include it in `DrawingCommand`.
3. Rendering in `src/drawing.ts`: add `drawCircle` and a branch in
   `drawCommand`. Because `ctx` is a parameter, it renders on screen and in
   export automatically.
4. Get circle input in `src/main.ts`: change`currentStroke` to a gesture that can
   be a `Stroke` or `Circle`. On pointer-down start it at the pointer, on
   pointer-move set the radius from the distance to the center, on pointer-up
   commit with `addCommand` (cancel instead if the radius is 0). Branch on
   `selectedTool.type`.
5. No changes necessary in: `history.ts` (undo/redo handle any `DrawingCommand`),
   `render.ts` (replays commands in order), `export.ts` (replays the same
   commands at 2x), and `renderPalette`.

## Credits

- Tooling adapted from the [CMPM 121 Fall 2026 D1 starter](https://github.com/ucsc-cmpm-121-f26/d1-starter/tree/d949e744b0f9fb7c133a5316f86f2b7fe54529ad), derived from the [S01 starter](https://github.com/ucsc-cmpm-121-f26/s01-starter/tree/8974888efb6537be82e8eb069db139ea885039da). Those repositories have no explicit repository license; no new license is assigned to that material. The D2 scaffold was authored with OpenCode/OpenAI GPT-6.1 Sol assistance. Dependencies retain their respective licenses.
- Claude and Copilot for debugging, TypeScript explanations, and README.md organization
