import { Line as LineType } from 'src/constants';
import { memo } from 'react';
import { Line, Rect } from 'react-konva';
import Konva from 'konva';
interface Shapes {
  lines: LineType[];
  rects: Konva.ShapeConfig[];
}

const TempShapes = ({ lines, rects = [] }: Shapes) => (
  <>
    {rects.length > 0 && <Rect {...rects[0]} key={'temp-rect'} />}
    {lines.map((options, l) => (
      <Line
        key={'temp-line' + l}
        listening={false}
        draggable={false}
        {...options}
        opacity={1}
        strokeWidth={5}
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
