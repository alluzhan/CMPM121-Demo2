# D2 starter

A minimal TypeScript/Vite browser project with Deno checks and GitHub Pages deployment.

## Credits

Tooling adapted from the [CMPM 121 Fall 2026 D1 starter](https://github.com/ucsc-cmpm-121-f26/d1-starter/tree/d949e744b0f9fb7c133a5316f86f2b7fe54529ad), derived from the [S01 starter](https://github.com/ucsc-cmpm-121-f26/s01-starter/tree/8974888efb6537be82e8eb069db139ea885039da). Those repositories have no explicit repository license; no new license is assigned to that material. The D2 scaffold was authored with OpenCode/OpenAI GPT-6.1 Sol assistance. Dependencies retain their respective licenses.

## User Documentation

### Link to Page

[https://alluzhan.github.io/CMPM121-Demo2/]

### Tools

- Thin and thick markers
- Three preset stickers: 🌸 🌿 😅
- Create custom sticker (up to three)
- Undo/redo button
- Redraw/clear button
- Export drawings as high-resolution PNG images

### How to Use

- Markers: Choose thin or thick, then drag on canvas to draw.
- Stickers: Select a sticker and click on canvas to place it.
- Buttons:
  - Undo/Redo: Allow multi-step navigate drawing history.
  - Redraw: Reconstruct canvas from saved commands.
  - Clear: Clear both canvas and history, not recoverable.
  - +New sticker: Click to create a new sticker tool.
  - Export PNG: download a png image of your canvas to local.

### Run Locally

Requirements:

- Deno
- Git
- Network Requirements: Internet access is required for the initial setup and dependency downloads.

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

## Developer Documentation
