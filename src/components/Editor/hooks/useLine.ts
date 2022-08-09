import Konva from 'konva';
import { useState } from 'react';
import { KonvaEventObject } from 'konva/lib/Node';
import { addShape } from 'src/redux/slices/layers/layers.actions';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { TOOLS } from 'src/constants';

const useLine = (selectedLayerId: number, selectedLayerColor: string) => {
  const dispatch = useAppDispatch();
  const { currentInstanceId } = useAppSelector(({ layers }) => layers);
  const [lines, setLines] = useState<Konva.ShapeConfig[]>([]);

  const lineConfig = {
    type: TOOLS.LINE,
    opacity: 1,
    stroke: selectedLayerColor,
    strokeWidth: 5,
    tension: 0.5,
    lineCap: 'round',
  } as const;

  const lineHandleMouseDown = (event: KonvaEventObject<WheelEvent>) => {
    //using getRelativePointerPosition instead of getPointerPosition as it respects the Stage current scale
    const { x, y } = event.target.getStage()!.getRelativePointerPosition()!;
    setLines([...lines, { points: [x, y], ...lineConfig }]);
  };

  const lineHandleMouseMove = (event: KonvaEventObject<WheelEvent>) => {
    // when the left button is clicked
    if (event.evt.buttons === 1) {
      const lastLine = lines[lines.length - 1] || [];

      const { x, y } = event.target.getStage()!.getRelativePointerPosition()!;
      // add point

      //make it a straight line
      if (lastLine.points?.length >= 2) {
        // const [lastX, lastY] = lastLine.points
        lastLine.points = lastLine.points.slice(0, 2).concat([x, y]);
      }

      // replace last line
      lines.splice(lines.length - 1, 1, lastLine);
      setLines(lines.concat());
    }
  };

  const lineHandleMouseUp = () => {
    if (lines.length > 0 && typeof currentInstanceId === 'number') {
      //just store lines in redux store when mouse click ends
      dispatch(
        addShape(selectedLayerId, currentInstanceId, lines[lines.length - 1])
      );

      //remove temp lines
      setLines([]);
    }
  };

  return {
    lineHandleMouseDown,
    lineHandleMouseUp,
    lineHandleMouseMove,
    lines,
  };
};

export default useLine;
