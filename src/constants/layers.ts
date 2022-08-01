import Konva from 'konva';
import _ from 'underscore';

export type Instance = {
  visible: boolean;
  id: string;
  shapes: Konva.ShapeConfig[];
};

export type Layer = {
  title: string;
  color: string;
  visible: boolean;
  instances: Instance[];
};

const mockLines = () =>
  [...Array(10)].map((_, i) => ({
    x: Math.random() * 1200,
    y: Math.random() * 500,
    width: Math.random() * 500,
    height: Math.random() * 500,
    fill: ['royalblue', 'chocolate', '#b5d5b6'][Math.floor(Math.random() * 3)],
    stroke: 'black',
  }));

export const layers: Layer[] = [
  {
    title: 'Flame',
    color: '#de15f4',
    visible: true,
    instances: [
      {
        visible: true,
        id: _.uniqueId(),
        shapes: [...mockLines()],
      },
      {
        visible: true,
        id: _.uniqueId(),
        shapes: [...mockLines()],
      },
      {
        visible: false,
        id: _.uniqueId(),
        shapes: [],
      },
    ],
  },
  {
    title: 'Containers',
    color: '#03a9f4',
    visible: true,
    instances: [
      {
        visible: true,
        id: _.uniqueId(),
        shapes: [],
      },
      {
        visible: true,
        id: _.uniqueId(),
        shapes: [],
      },
      {
        visible: false,
        id: _.uniqueId(),
        shapes: [],
      },
    ],
  },
];
