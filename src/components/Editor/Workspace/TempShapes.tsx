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
        key={'temp-rect'}
        fill={classColor.replace(')', ', 0.6)').replace('rgb', 'rgba')}
      />
    )}
    {lines.map((options, l) => (
      <Line
        key={'temp-line' + l}
        listening={false}
        draggable={false}
        {...options}
        opacity={0.7}
        strokeWidth={10}
        tension={0.5}
        lineCap="round"
      />
    ))}
  </>
);

function propsChanged(_prevProps: any, nextProps: Shapes) {
  const { lines, rects = [] } = nextProps;
  if (lines.length > 1 || rects.length > 1) {
    return true;
  }
  return false;
}
export default memo(TempShapes, propsChanged);
