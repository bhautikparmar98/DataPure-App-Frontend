import { KonvaEventObject } from 'konva/lib/Node';
import { useState } from 'react';
import { TOOLS, Line } from 'src/constants';
import { addAnnotation } from 'src/redux/slices/classes/classes.actions';
import { useAppDispatch } from 'src/redux/store';
import uniqid from 'uniqid';

interface LineWithStroke extends Line {
  stroke: string;
}

const useLine = (
  selectedClassIndex: number,
  classId: string,
  selectedClassColor: string
) => {
  const dispatch = useAppDispatch();

  const [lines, setLines] = useState<LineWithStroke[]>([]);

  const lineConfig = {
    type: TOOLS.LINE,
    id: uniqid(),
    stroke: selectedClassColor,
  } as const;

  const lineHandleMouseDown = (event: KonvaEventObject<WheelEvent>) => {
    //using getRelativePointerPosition instead of getPointerPosition as it respects the Stage current scale
    const { x, y } = event.target.getStage()!.getRelativePointerPosition()!;
    setLines([...lines, { ...lineConfig, points: [x, y] }]);
  };

  const lineHandleMouseMove = (event: KonvaEventObject<WheelEvent>) => {
    // check the left button is clicked or not
    if (event.evt.buttons !== 1) return;
    const lastLine = lines[lines.length - 1] || [];

    const { x, y } = event.target.getStage()!.getRelativePointerPosition()!;
    // add point

    //make it a straight line
    if (lastLine?.points?.length >= 2) {
      // const [lastX, lastY] = lastLine.points
      lastLine.points = lastLine.points.slice(0, 2).concat([x, y]);
    }

    // replace last line
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const lineHandleMouseUp = () => {
    // checks that it's not a dot, but a line
    if (lines[0].points?.length > 2) {
      const linesWithoutStoke = lines.map(({ stroke, ...rest }) => rest);

      dispatch(
        addAnnotation(selectedClassIndex, classId, {
          visible: true,
          id: uniqid(),
          shapes: [{ ...linesWithoutStoke[linesWithoutStoke.length - 1] }],
        })
      );
    }

    //remove temp lines
    setLines([]);
  };

  return {
    lineHandleMouseDown,
    lineHandleMouseUp,
    lineHandleMouseMove,
    lines,
  };
};

export default useLine;
