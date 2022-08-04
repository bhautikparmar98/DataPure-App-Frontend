export const TOOLS = {
  SELECT: 'Select',
  LINE: 'Line',
  RECTANGLE: 'Rectangle',
  ERASER: 'Eraser',
  // PEN: 'Pen',
  // PEN_TOOL: 'Pentool',
  // BRUSH: 'Brush',
} as const;

type Keys = keyof typeof TOOLS;

export type Tool = typeof TOOLS[Keys];
