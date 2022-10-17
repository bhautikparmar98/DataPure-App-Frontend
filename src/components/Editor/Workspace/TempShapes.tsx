import { Line as LineType } from 'src/constants';
import { memo } from 'react';
import { Line, Rect } from 'react-konva';
import Konva from 'konva';
interface Shapes {
  lines: LineType[];
  rects: Konva.ShapeConfig[];
  classColor: string;
}

const TempShapes = ({ lines, rects = [], classColor }: Shapes) => (
  <>
    {rects.length > 0 && (
      <Rect
        {...rects[0]}
        listening={false}
        key={'temp-rect'}
        strokeWidth={1}
        fill={classColor.replace(')', ', 0.35)').replace('rgb', 'rgba')}
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
  const { lines, rects = [] } = nextProps;
  return lines.length > 1 || rects.length > 1;
}
export default memo(TempShapes, propsChanged);
