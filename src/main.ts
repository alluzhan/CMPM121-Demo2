import { drawCommand, type Point, type Stroke } from "./drawing.ts";
import { addTool, type Tool, tools } from "./tools.ts";
import { renderScene } from "./render.ts";
import { exportPng } from "./export.ts";
import {
  activeCommands,
  addCommand,
  canRedo,
  canUndo,
  clearHistory,
  redo,
  undo,
} from "./history.ts";

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const palette = document.querySelector<HTMLDivElement>("#palette")!;
const redrawButton = document.querySelector<HTMLButtonElement>("#redraw")!;
const undoButton = document.querySelector<HTMLButtonElement>("#undo")!;
const redoButton = document.querySelector<HTMLButtonElement>("#redo")!;
const clearButton = document.querySelector<HTMLButtonElement>("#clear")!;
const exportButton = document.querySelector<HTMLButtonElement>("#export")!;
const newToolButton = document.querySelector<HTMLButtonElement>("#newTool")!;

const pen = canvas.getContext("2d")!;

let currentStroke: Stroke | null = null;
let activePointerId: number | null = null;
let selectedTool: Tool = tools[0];

// convert pointer coordinates to canvas coordinates
function pointerToCanvas(event: PointerEvent): Point {
  const bounds = canvas.getBoundingClientRect();

  return {
    x: (event.clientX - bounds.left) * canvas.width / bounds.width,
    y: (event.clientY - bounds.top) * canvas.height / bounds.height,
  };
}

// palette is generated from the tools array
function renderPalette() {
  palette.replaceChildren(...tools.map((tool) => {
    const button = document.createElement("button");
    button.textContent = tool.name;
    button.style.outline = tool === selectedTool ? "3px solid #fbb1cd" : "";
    button.style.outlineOffset = "1px";
    button.addEventListener("click", () => {
      selectedTool = tool;
      renderPalette();
    });
    return button;
  }));
}

function updateButtons() {
  undoButton.disabled = !canUndo();
  redoButton.disabled = !canRedo();
}

function render() {
  renderScene(pen, activeCommands());
  if (currentStroke !== null) drawCommand(pen, currentStroke);
  updateButtons();
}

// discard the in-progress gesture without committing anything
function cancelGesture() {
  currentStroke = null;
  activePointerId = null;
  render();
}

canvas.addEventListener("pointerdown", (event) => {
  if (activePointerId !== null) return;

  if (selectedTool.type === "sticker") {
    const point = pointerToCanvas(event);

    addCommand({
      type: "sticker",
      x: point.x,
      y: point.y,
      emoji: selectedTool.emoji,
      size: selectedTool.size,
    });

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
  addCommand(currentStroke);

  currentStroke = null;
  activePointerId = null;
  render();
});

canvas.addEventListener("pointercancel", (event) => {
  if (event.pointerId !== activePointerId) return;
  cancelGesture();
});

//Cancel gesture on Escape key --> it not saved in the history
globalThis.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && currentStroke) cancelGesture();
});

// Redraw: wipe only the pixels, then rebuild from the document
redrawButton.addEventListener("click", () => {
  pen.clearRect(0, 0, canvas.width, canvas.height);
  render();
});

undoButton.addEventListener("click", () => {
  undo();
  render();
});

redoButton.addEventListener("click", () => {
  redo();
  render();
});

// Clear: deletes the document and the history
clearButton.addEventListener("click", () => {
  if (!confirm("Clear the whole drawing? This can't be undone.")) return;
  clearHistory();
  currentStroke = null;
  activePointerId = null;
  render();
});

exportButton.addEventListener(
  "click",
  () => exportPng(activeCommands(), canvas.width, canvas.height),
);

// add new tool button
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
