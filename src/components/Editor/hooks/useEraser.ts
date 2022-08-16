import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useRef, useState } from 'react';
import { addEraserLines } from 'src/redux/slices/classes/classes.actions';
import { useAppDispatch } from 'src/redux/store';

/* 
  TODO: 
    - Erased parts are shown out of rectangles, cut parts out of rectangles borders
    - Make the erased part's stroke width responsive to the Stage zoom scale
*/

const useEraser = (selectedClassIndex: number, selectedClassColor: string) => {
  const dispatch = useAppDispatch();

  const rectId = useRef('');
  const [lines, setLines] = useState<Konva.ShapeConfig[]>([]);

  const EraserConfig = {
    type: 'ERASER',
    opacity: 1,
    stroke: selectedClassColor,
    strokeWidth: 25,

    globalCompositeOperation: 'destination-out', //for erasing effect
  } as const;

  const eraseHandleMouseDown = (event: KonvaEventObject<WheelEvent>) => {
    if (event.target.attrs?.id?.length > 0 && rectId.current === '') {
      rectId.current = event.target.attrs.id;
    }

    //using getRelativePointerPosition instead of getPointerPosition as it respects the Stage current scale
    const { x, y } = event.target.getStage()!.getRelativePointerPosition()!;
    setLines([...lines, { points: [x, y], ...EraserConfig }]);
  };

  const eraseHandleMouseMove = (event: KonvaEventObject<WheelEvent>) => {
    // when the left button is clicked
    if (event.evt.buttons === 1) {
      if (event.target.attrs?.id?.length > 0 && rectId.current === '') {
        rectId.current = event.target.attrs.id;
      }
      const lastLine = lines[lines.length - 1] || [];

      const { x, y } = event.target.getStage()!.getRelativePointerPosition()!;
      // add point
      lastLine.points = lastLine.points.concat([x, y]);

      // replace last line
      lines.splice(lines.length - 1, 1, lastLine);
      setLines(lines.concat());
    }
  };

  const eraseHandleMouseUp = (event: KonvaEventObject<WheelEvent>) => {
    if (lines.length > 0) {
      //just store lines in redux store when mouse click ends
      if (rectId.current?.length > 0) {
        dispatch(addEraserLines(selectedClassIndex, rectId.current, lines));
        rectId.current = '';
      }
      //remove temp lines
      setLines([]);
    }
  };

  return {
    eraseHandleMouseDown,
    eraseHandleMouseUp,
    eraseHandleMouseMove,
    eraserLines: lines,
  };
};

export default useEraser;
