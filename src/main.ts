import {
  drawCommand,
  type DrawingCommand,
  type Point,
  type Stroke,
} from "./drawing.ts";

import { addTool, type Tool, tools } from "./tools.ts";
import { renderScene } from "./render.ts";
import { exportPng } from "./export.ts";

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const palette = document.querySelector<HTMLDivElement>("#palette")!;
const redrawButton = document.querySelector<HTMLButtonElement>("#redraw")!;
const undoButton = document.querySelector<HTMLButtonElement>("#undo")!;
const redoButton = document.querySelector<HTMLButtonElement>("#redo")!;

document.querySelector<HTMLButtonElement>("#export")!.addEventListener(
  "click",
  () => exportPng(commands, canvas.width, canvas.height),
);

const pen = canvas.getContext("2d")!;

const commands: DrawingCommand[] = [];
const undoneCommands: DrawingCommand[] = [];

let currentStroke: Stroke | null = null;
let activePointerId: number | null = null;

// convert pointer coordinates to canvas coordinates
function pointerToCanvas(event: PointerEvent): Point {
  const bounds = canvas.getBoundingClientRect();

  return {
    x: (event.clientX - bounds.left) * canvas.width / bounds.width,
    y: (event.clientY - bounds.top) * canvas.height / bounds.height,
  };
}

//choose tools
let selectedTool: Tool = tools[0];

function renderPalette() {
  palette.replaceChildren(...tools.map((tool) => {
    const button = document.createElement("button");
    button.textContent = tool.name;
    button.style.outline = tool === selectedTool ? "2px solid pink" : "";
    button.addEventListener("click", () => {
      selectedTool = tool;
      renderPalette();
    });
    return button;
  }));
}

function updateButtons() {
  undoButton.disabled = commands.length === 0;
  redoButton.disabled = undoneCommands.length === 0;
}

function render() {
  renderScene(pen, commands);
  if (currentStroke !== null) drawCommand(pen, currentStroke);
  updateButtons();
}

function undo() {
  const command = commands.pop();

  if (command) {
    undoneCommands.push(command);
    render();
  }
}

function redo() {
  const command = undoneCommands.pop();

  if (command) {
    commands.push(command);
    render();
  }
}

canvas.addEventListener("pointerdown", (event) => {
  if (activePointerId !== null) return;

  if (selectedTool.type === "sticker") {
    const point = pointerToCanvas(event);

    commands.push({
      type: "sticker",
      x: point.x,
      y: point.y,
      emoji: selectedTool.emoji,
      size: selectedTool.size,
    });

    undoneCommands.length = 0;
    render();
    return;
  }

  activePointerId = event.pointerId;
  canvas.setPointerCapture(event.pointerId);

  currentStroke = {
    type: "stroke",
    points: [pointerToCanvas(event)],
    color: "black",
    width: selectedTool.width,
  };
});

canvas.addEventListener("pointermove", (event) => {
  if (event.pointerId !== activePointerId || !currentStroke) return;

  currentStroke.points.push(pointerToCanvas(event));
  render();
});

canvas.addEventListener("pointerup", (event) => {
  if (event.pointerId !== activePointerId || !currentStroke) return;

  currentStroke.points.push(pointerToCanvas(event));
  commands.push(currentStroke);
  undoneCommands.length = 0;

  currentStroke = null;
  activePointerId = null;
  render();
});

canvas.addEventListener("pointercancel", (event) => {
  if (event.pointerId !== activePointerId) return;

  currentStroke = null;
  activePointerId = null;
  render();
});

redrawButton.addEventListener("click", render);
undoButton.addEventListener("click", undo);
redoButton.addEventListener("click", redo);

//add new tool button
const newToolButton = document.querySelector<HTMLButtonElement>("#newTool")!;
const MAX_STICKER_LENGTH = 15;
const MAX_CUSTOM_STICKERS = 3;
let customStickerCount = 0;

newToolButton.addEventListener("click", () => {
  if (customStickerCount >= MAX_CUSTOM_STICKERS) {
    alert(`You can only make ${MAX_CUSTOM_STICKERS} custom stickers.`);
    return;
  }

  const newSticker = prompt(
    `Enter an emoji or short text (max ${MAX_STICKER_LENGTH} characters):`,
  )?.trim();
  if (!newSticker) return;

  if ([...newSticker].length > MAX_STICKER_LENGTH) {
    alert(`Too long. Please use ${MAX_STICKER_LENGTH} characters or fewer.`);
    return;
  }

  const name = prompt("Sticker Name (optional):")?.trim() || newSticker;
  const tool: Tool = {
    id: `custom-${customStickerCount}`,
    name,
    type: "sticker",
    emoji: newSticker,
    size: 40,
  };
  addTool(tool);
  customStickerCount++;
  selectedTool = tool;
  renderPalette();

  if (customStickerCount >= MAX_CUSTOM_STICKERS) {
    newToolButton.disabled = true;
  }
});

renderPalette();
render();
