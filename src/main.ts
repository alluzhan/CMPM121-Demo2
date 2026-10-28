import {
  drawCommand,
  type DrawingCommand,
  type Point,
  type Stroke,
} from "./drawing.ts";

import { tools } from "./tools.ts";

// Get HTML elements
const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const redrawButton = document.querySelector<HTMLButtonElement>("#redraw")!;
const undoButton = document.querySelector<HTMLButtonElement>("#undo")!;
const redoButton = document.querySelector<HTMLButtonElement>("#redo")!;
const pen = canvas.getContext("2d")!;

// Drawing data
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

// choose tool
let selectedTool = tools.thin;
document.querySelectorAll<HTMLButtonElement>(".tool").forEach((button) => {
  button.addEventListener("click", () => {
    const toolId = button.dataset.tool!;

    selectedTool = tools[toolId];
  });
});

// unable button
function updateButtons() {
  undoButton.disabled = commands.length === 0;
  redoButton.disabled = undoneCommands.length === 0;
}

function render() {
  pen.clearRect(0, 0, canvas.width, canvas.height);

  for (const command of commands) {
    drawCommand(pen, command);
  }

  if (currentStroke !== null) {
    drawCommand(pen, currentStroke);
  }

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

// start a stroke
canvas.addEventListener("pointerdown", (event) => {
  if (activePointerId !== null) return;

  if (selectedTool.type === "sticker") {
    const point = pointerToCanvas(event);

    commands.push({
      type: "sticker",
      x: point.x,
      y: point.y,
      emoji: selectedTool.emoji!,
      size: selectedTool.size!,
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
    width: selectedTool.width!,
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
render();
