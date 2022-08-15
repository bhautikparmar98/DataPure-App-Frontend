import uniqid from 'uniqid';
import { TOOLS } from './tools';

export interface Line {
  id: string;
  points: number[];
  type: typeof TOOLS.LINE;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}
export interface Rectangle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: typeof TOOLS.RECTANGLE;
  points?: [];
}

// shapes are array and each array element will represent Konva.Group. This is done to so if there are erased parts, they will be grouped together with their rectangle/polygon and when the shape is dragged, the erased part is dragged too
export interface Annotation {
  visible: boolean;
  id?: string;
  _id?: string;
  classId?: string;
  shapes: (Rectangle | Line)[];
}

export interface Class {
  name: string;
  color: string;
  visible?: boolean;
  selectedClassId?: number;
  annotations: Annotation[];
  _id: string;
}

// const mockRects = () =>
//   [...Array(2)].map((_, i) => {
//     if (i % 2 === 0) {
//       return {
//         id: uniqid(),
//         type: TOOLS.RECTANGLE,
//         x: Math.random() * 600,
//         y: Math.random() * 300,
//         width: Math.random() * 300,
//         height: Math.random() * 400,
//       };
//     }
//     return {
//       id: uniqid(),
//       type: TOOLS.LINE,
//       points: [...Array(4)].map((a) => Math.random() * 500),
//     };
//   });

export const classes: Class[] = [
  {
    name: 'Flame',
    color: 'rgb(3,169,244)',
    _id: 'dummy_id',
    annotations: [
      {
        visible: true,
        id: uniqid(),
        shapes: [],
      },
    ],
  },
  {
    name: 'Containers',
    color: 'rgb(15,220,144)',
    _id: 'dummy_id2',
    annotations: [
      {
        visible: true,
        id: uniqid(),
        shapes: [],
      },
    ],
  },
];
