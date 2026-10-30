import { drawCommand, type DrawingCommand } from "./drawing.ts";

export function renderScene(
  ctx: CanvasRenderingContext2D,
  commands: readonly DrawingCommand[],
  scale = 1,
) {
  const { width, height } = ctx.canvas;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);

  for (const command of commands) {
    ctx.save();
    ctx.scale(scale, scale);
    drawCommand(ctx, command);
    ctx.restore();
  }
}
