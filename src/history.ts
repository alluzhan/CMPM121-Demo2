import type { DrawingCommand } from "./drawing.ts";

export const commands: DrawingCommand[] = [];
export const undoneCommands: DrawingCommand[] = [];

export function addCommand(command: DrawingCommand) {
  commands.push(command);
  undoneCommands.length = 0;
}

export function undo() {
  const command = commands.pop();

  if (command) {
    undoneCommands.push(command);
  }
}

export function redo() {
  const command = undoneCommands.pop();

  if (command) {
    commands.push(command);
  }
}
