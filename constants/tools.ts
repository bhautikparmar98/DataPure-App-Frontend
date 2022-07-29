export const TOOLS = {
  PEN: 'Pen',
  PEN_TOOL: 'Pentool',
  RECTANGLE: 'Rectangle',
  ERASER: 'Eraser',
  BRUSH: 'Brush',
} as const;

type Keys = keyof typeof TOOLS;

export type Tool = typeof TOOLS[Keys];
