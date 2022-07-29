import _ from 'underscore';

export type Layer = {
  visible: boolean;
  id: string;
};

export type Mask = {
  title: string;
  color: string;
  layers: Layer[];
};

export const masks: Mask[] = [
  {
    title: 'Flame',
    color: '#de15f4',
    layers: [
      {
        visible: true,
        id: _.uniqueId(),
      },
      {
        visible: true,
        id: _.uniqueId(),
      },
      {
        visible: false,
        id: _.uniqueId(),
      },
    ],
  },
  {
    title: 'Containers',
    color: '#03a9f4',
    layers: [
      {
        visible: true,
        id: _.uniqueId(),
      },
      {
        visible: true,
        id: _.uniqueId(),
      },
      {
        visible: false,
        id: _.uniqueId(),
      },
    ],
  },
];
