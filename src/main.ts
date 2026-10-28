import { drawStroke, type Point, type Stroke } from "./drawing.ts";

// Get HTML elements
const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const redrawButton = document.querySelector<HTMLButtonElement>("#redraw")!;
const undoButton = document.querySelector<HTMLButtonElement>("#undo")!;
const redoButton = document.querySelector<HTMLButtonElement>("#redo")!;
const pen = canvas.getContext("2d")!;

// Drawing data
const strokes: Stroke[] = [];
const undoneStrokes: Stroke[] = [];

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

// unable button
function updateButtons() {
  undoButton.disabled = strokes.length === 0;
  redoButton.disabled = undoneStrokes.length === 0;
}

function render() {
  pen.clearRect(0, 0, canvas.width, canvas.height);

  for (const stroke of strokes) {
    drawStroke(pen, stroke);
  }

  if (currentStroke !== null) {
    drawStroke(pen, currentStroke);
  }

  updateButtons();
}

function undo() {
  const stroke = strokes.pop();

  if (stroke) {
    undoneStrokes.push(stroke);
    render();
  }
}

function redo() {
  const stroke = undoneStrokes.pop();

  if (stroke) {
    strokes.push(stroke);
    render();
  }
}

// start a stroke
canvas.addEventListener("pointerdown", (event) => {
  if (activePointerId !== null) return;

  activePointerId = event.pointerId;
  canvas.setPointerCapture(event.pointerId);

  currentStroke = {
    points: [pointerToCanvas(event)],
    color: "black",
    width: 2,
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
  strokes.push(currentStroke);
  undoneStrokes.length = 0;

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
