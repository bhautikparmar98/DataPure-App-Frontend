import Konva from 'konva';
import { useCallback, useRef, useState } from 'react';
import { KonvaEventObject } from 'konva/lib/Node';
import { addEraserLines } from 'src/redux/slices/editor/editor.actions';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { TOOLS } from 'src/constants';
import _ from 'underscore';

/* 
  TODO: 
    - Erased parts are shown out of rectangles, cut parts out of rectangles borders
    - Make the erased part's stroke width responsive to the Stage zoom scale
*/

const useEraser = (selectedLayerId: number, selectedLayerColor: string) => {
  const { tool } = useAppSelector(({ editor }) => editor);
  const dispatch = useAppDispatch();

  const rectId = useRef('');
  const [lines, setLines] = useState<Konva.ShapeConfig[]>([]);

  const EraserConfig = {
    type: TOOLS.ERASER,
    opacity: 1,
    stroke: selectedLayerColor,
    globalCompositeOperation: 'destination-out', //for erasing effect
  } as const;

  const memoisedFunc = useCallback(() => {}, []);

  // !Enhance this part instead of calling memoised function
  if (tool !== TOOLS.ERASER) {
    return {
      eraseHandleDragStart: memoisedFunc,
      eraseHandleDragEnd: memoisedFunc,
      eraseHandleMouseDown: memoisedFunc,
      eraseHandleMouseUp: memoisedFunc,
      eraseHandleMouseMove: memoisedFunc,
      eraserLines: [],
    };
  }

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
        dispatch(addEraserLines(selectedLayerId, rectId.current, lines));
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
