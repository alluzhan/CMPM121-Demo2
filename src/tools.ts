export type Tool = {
  name: string;
  type: "stroke" | "sticker";
  width?: number;
  emoji?: string;
  size?: number;
};

export const tools: Record<string, Tool> = {
  thin: {
    name: "Thin Marker",
    type: "stroke",
    width: 2,
  },
  thick: {
    name: "Thick Marker",
    type: "stroke",
    width: 10,
  },
  flower: {
    name: "Flower",
    type: "sticker",
    emoji: "🌸",
    size: 40,
  },
  grass: {
    name: "Grass",
    type: "sticker",
    emoji: "🌿",
    size: 40,
  },
  sweat: {
    name: "Sweat Emoji",
    type: "sticker",
    emoji: "😅",
    size: 40,
  },
};
