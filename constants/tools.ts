export const TOOLS = {
  PEN: 'Pen',
  RECTANGLE: 'Rectangle',
  PEN_TOOL: 'Pentool',
  BRUSH: 'Brush',
  ERASER: 'Eraser',
} as const;

type Keys = keyof typeof TOOLS;

export type Tool = typeof TOOLS[Keys];
