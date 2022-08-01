import Konva from 'konva';
import { useCallback, useState } from 'react';
import { KonvaEventObject } from 'konva/lib/Node';
import { addInstance } from 'src/redux/slices/editor/editor.actions';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import useTool from './useTool';
import { TOOLS } from 'src/constants';
import _ from 'underscore';

const useEraser = (
  selectedLayerId: number,
  selectedLayerColor: string,
  workspaceRef: React.RefObject<HTMLDivElement>
) => {
  const { isDrawing, tool } = useAppSelector(({ editor }) => editor);
  const dispatch = useAppDispatch();
  const { setCursorStyle } = useTool(workspaceRef);
  const [erasedParts, setErasedParts] = useState<Konva.ShapeConfig[]>([]);

  const EraserConfig = {
    type: TOOLS.ERASER,
    fill: selectedLayerColor,
    globalCompositeOperation: 'destination-out', //for erasing effect
    opacity: 1,
    // strokeWidth: 0,
    radius: 25,
  } as const;

  const memoisedFunc = useCallback(() => {}, []);

  if (tool !== TOOLS.ERASER) {
    return {
      eraseHandleDragStart: memoisedFunc,
      eraseHandleDragEnd: memoisedFunc,
      eraseHandleMouseDown: memoisedFunc,
      eraseHandleMouseUp: memoisedFunc,
      eraseHandleMouseMove: memoisedFunc,
      erasedParts: [],
    };
  }

  const eraseHandleMouseDown = (event: KonvaEventObject<WheelEvent>) => {
    //using getRelativePointerPosition instead of getPointerPosition as it respects the Stage current scale
    const { x, y } = event.target.getStage()!.getRelativePointerPosition()!;

    if (x != null && y != null) {
      setErasedParts((prevAnnos) => {
        return [...prevAnnos, { x, y, ...EraserConfig }];
      });
    }
  };

  const eraseHandleMouseMove = (event: KonvaEventObject<WheelEvent>) => {
    // when the left button is clicked
    if (event.evt.buttons === 1) {
      const { x, y } = event.target.getStage()!.getRelativePointerPosition()!;
      if (x != null && y != null) {
        setErasedParts((prevAnnos) => [
          ...prevAnnos,
          { x, y, ...EraserConfig },
        ]);
      }
    }
  };

  const eraseHandleMouseUp = (event: KonvaEventObject<WheelEvent>) => {
    if (erasedParts.length > 0) {
      // !set the selected instanceId here instead
      dispatch(
        addInstance(selectedLayerId, {
          visible: true,
          id: _.uniqueId(),
          shapes: [...erasedParts],
        })
      );
    }
  };

  return {
    eraseHandleMouseDown,
    eraseHandleMouseUp,
    eraseHandleMouseMove,
    erasedParts,
  };
};

export default useEraser;
