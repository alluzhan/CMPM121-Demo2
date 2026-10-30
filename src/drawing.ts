export type Point = {
  x: number;
  y: number;
};

export type Stroke = {
  type: "stroke";
  points: Point[];
  color: string;
  width: number;
};

export type Sticker = {
  type: "sticker";
  x: number;
  y: number;
  emoji: string;
  size: number;
};

export type DrawingCommand = Stroke | Sticker;

// draw stroke
function drawStroke(ctx: CanvasRenderingContext2D, stroke: Stroke) {
  if (stroke.points.length === 0) return;

  ctx.beginPath();
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = stroke.width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
  for (let i = 1; i < stroke.points.length; i++) {
    ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
  }
  if (stroke.points.length === 1) {
    ctx.lineTo(stroke.points[0].x + 0.01, stroke.points[0].y);
  }
  ctx.stroke();
}

// draw sticker
function drawSticker(ctx: CanvasRenderingContext2D, sticker: Sticker) {
  ctx.fillStyle = "black";
  ctx.font = `${sticker.size}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(sticker.emoji, sticker.x, sticker.y);
}

// draw anything
export function drawCommand(
  ctx: CanvasRenderingContext2D,
  command: DrawingCommand,
) {
  ctx.save();

  if (command.type === "stroke") {
    drawStroke(ctx, command);
  } else {
    drawSticker(ctx, command);
  }

  ctx.restore();
}
