import _ from 'underscore';

export type Instance = {
  visible: boolean;
  id: string;
};

export type Mask = {
  title: string;
  color: string;
  instances: Instance[];
};

export const masks: Mask[] = [
  {
    title: 'Flame',
    color: '#de15f4',
    instances: [
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
    instances: [
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
