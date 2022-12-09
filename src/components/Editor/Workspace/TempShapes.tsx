import { Line as LineType } from 'src/constants';
import { memo } from 'react';
import { Line, Rect } from 'react-konva';
import Konva from 'konva';
interface Shapes {
  lines: LineType[];
  rects: Konva.ShapeConfig[];
  classColor: string;
  stageScale: number;
  Area: Konva.ShapeConfig[];
}

const TempShapes = ({ lines = [], rects = [], Area = [], classColor, stageScale }: Shapes) => (

  <>
    {rects.length > 0 && (
      <Rect
        {...rects[0]}
        listening={false}
        key={'temp-rect'}
        strokeWidth={3 / stageScale}
        fill={classColor.replace(')', ', 0.35)').replace('rgb', 'rgba')}
      />
    )}
     {Area.length > 0 && (
      <Rect
        {...Area[0]}
        listening={false}
        key={'temp-rect'}
        strokeWidth={3 / stageScale}
        fill="rgba(237, 250, 248,0.35)"
      />
    )}
    {lines.map((options, l) => (
      <Line
        key={'temp-line' + l}
        listening={false}
        draggable={false}
        {...options}
        opacity={0.7}
        strokeWidth={3}
        tension={0.5}
        lineCap="round"
      />
    ))}
  </>
);

function propsChanged(_prevProps: any, nextProps: Shapes) {
  const { lines = [], rects = [] } = nextProps;
  return lines.length > 1 || rects.length > 1;
}
export default memo(TempShapes, propsChanged);
