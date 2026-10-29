export type Tool =
  & { id: string; name: string }
  & (
    | { type: "stroke"; width: number }
    | { type: "sticker"; emoji: string; size: number }
  );

export const tools: Tool[] = [
  { id: "thin", name: "Thin Marker", type: "stroke", width: 2 },
  { id: "thick", name: "Thick Marker", type: "stroke", width: 10 },
  { id: "flower", name: "🌸", type: "sticker", emoji: "🌸", size: 40 },
  { id: "grass", name: "🌿", type: "sticker", emoji: "🌿", size: 40 },
  { id: "sweat", name: "😅", type: "sticker", emoji: "😅", size: 40 },
];

export function addTool(tool: Tool) {
  tools.push(tool);
}
