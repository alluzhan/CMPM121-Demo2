const app = document.querySelector<HTMLElement>("#app")!;

const heading = document.createElement("h1");
heading.textContent = "Sketchpad";

const canvas = document.createElement("canvas");
canvas.width = 500;
canvas.height = 500;
canvas.style.outline = "5px solid #333";
canvas.style.touchAction = "none";

const pen = canvas.getContext("2d")!;

// Function to convert pointer event coordinates to canvas coordinates
function pointerToCanvas(event: PointerEvent) {
  const canvasBounds = canvas.getBoundingClientRect();
  return {
    x: event.clientX - canvasBounds.left,
    y: event.clientY - canvasBounds.top,
  };
}

let previousPoint: { x: number; y: number } | null = null;

/*If the pointer is down, start drawing. If the pointer moves, draw a line from the previous point
to the current point. When the pointer is lifted or canceled, drawing is stopped. */
canvas.addEventListener("pointerdown", (event) => {
  canvas.setPointerCapture(event.pointerId);
  previousPoint = pointerToCanvas(event);
});

canvas.addEventListener("pointermove", (event) => {
  if (!previousPoint) return;
  const currentPoint = pointerToCanvas(event);
  pen.beginPath();
  pen.moveTo(previousPoint.x, previousPoint.y);
  pen.lineTo(currentPoint.x, currentPoint.y);
  pen.stroke();
  previousPoint = currentPoint;
});

canvas.addEventListener("pointerup", () => (previousPoint = null));
canvas.addEventListener("pointercancel", () => (previousPoint = null));

app.append(heading, canvas);
