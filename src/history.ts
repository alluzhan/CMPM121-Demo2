import type { DrawingCommand } from "./drawing.ts";

const commands: DrawingCommand[] = [];
const undoneCommands: DrawingCommand[] = [];

export const activeCommands = (): readonly DrawingCommand[] => commands;
export const canUndo = () => commands.length > 0;
export const canRedo = () => undoneCommands.length > 0;

export function addCommand(command: DrawingCommand) {
  commands.push(command);
  undoneCommands.length = 0;
}
export function undo() {
  const command = commands.pop();
  if (command) undoneCommands.push(command);
}
export function redo() {
  const command = undoneCommands.pop();
  if (command) commands.push(command);
}
export function clearHistory() {
  commands.length = 0;
  undoneCommands.length = 0;
}
