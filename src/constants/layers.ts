import Konva from 'konva';
import uniqid from 'uniqid';
import { Tool } from './tools';

// shapes are array and each array element will represent Konva.Group. This is done to so if there are erased parts, they will be grouped together with their rectangle/polygon and when the shape is dragged, the erased part is dragged too
export type Instance = {
  visible: boolean;
  id: string;
  shapes: [Konva.ShapeConfig[] & { type?: Tool; id?: string }];
};

export type Layer = {
  title: string;
  color: string;
  visible: boolean;
  instances: Instance[];
};

const mockRects = () =>
  [...Array(1)].map((_, i) => ({
    id: (Math.random() * 10).toString(),
    x: Math.random() * 600,
    y: Math.random() * 300,
    width: Math.random() * 300,
    height: Math.random() * 400,
    fill: ['rgba(15,220,144,0.3)', 'rgba(3,169,244,0.3)'][
      Math.floor(Math.random() * 2)
    ],
    stroke: ['rgb(15,220,144)', 'rgb(3,169,244)'][
      Math.floor(Math.random() * 2)
    ],
  }));

export const layers: Layer[] = [
  {
    title: 'Flame',
    color: 'rgb(3,169,244)',
    visible: true,
    instances: [
      {
        visible: true,
        id: uniqid(),
        shapes: [[...mockRects()]],
      },
    ],
  },
  {
    title: 'Containers',
    color: 'rgb(15,220,144)',
    visible: true,
    instances: [
      {
        visible: true,
        id: uniqid(),
        shapes: [[...mockRects()]],
      },
    ],
  },
];
