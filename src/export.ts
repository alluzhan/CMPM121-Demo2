import type { DrawingCommand } from "./drawing.ts";
import { renderScene } from "./render.ts";

export function exportPng(
  commands: readonly DrawingCommand[],
  width: number,
  height: number,
  scale = 2,
) {
  const out = document.createElement("canvas");
  out.width = width * scale;
  out.height = height * scale;
  renderScene(out.getContext("2d")!, commands, scale);

  out.toBlob((blob) => {
    if (!blob) return;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sketch.png";
    link.click();
    URL.revokeObjectURL(link.href);
  }, "image/png");
}
