import Konva from 'konva';
import { useCallback, useState } from 'react';
import { KonvaEventObject } from 'konva/lib/Node';
import {
  addInstance,
  endDrawing,
  startDrawing,
} from 'src/redux/slices/editor/editor.actions';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import useTool from './useTool';
import { TOOLS } from 'src/constants';
import _ from 'underscore';

const useRect = (
  selectedLayerId: number,
  selectedLayerColor: string,
  workspaceRef: React.RefObject<HTMLDivElement>
) => {
  const { isDrawing, tool } = useAppSelector(({ editor }) => editor);
  const dispatch = useAppDispatch();
  const { setCursorStyle } = useTool(workspaceRef);
  const [annotations, setAnnotations] = useState<Konva.ShapeConfig[]>([]);
  const [newAnnotation, setNewAnnotation] = useState<Konva.ShapeConfig[]>([]);

  const memoisedFunc = useCallback(() => {}, []);

  if (tool !== TOOLS.RECTANGLE) {
    return {
      rectHandleDragStart: memoisedFunc,
      rectHandleDragEnd: memoisedFunc,
      rectHandleMouseDown: memoisedFunc,
      rectHandleMouseUp: memoisedFunc,
      rectHandleMouseMove: memoisedFunc,
      rects: [],
    };
  }

  const config = {
    fill: selectedLayerColor.replace(')', ', 0.3)').replace('rgb', 'rgba'),
    opacity: 0.7,
    stroke: selectedLayerColor,
    strokeWidth: 5,
    globalCompositeOperation: 'source-over',
  } as const;

  const rectHandleDragStart = (e: KonvaEventObject<WheelEvent>) => {
    setCursorStyle('move');
    rects = [];
    setNewAnnotation([]);
    dispatch(endDrawing());
  };

  const rectHandleDragEnd = (e: KonvaEventObject<WheelEvent>) => {
    setCursorStyle();
    setNewAnnotation([]);
    dispatch(startDrawing());
    rects = [];
  };

  const rectHandleMouseDown = (event: KonvaEventObject<WheelEvent>) => {
    if (newAnnotation.length === 0 && isDrawing) {
      //using getRelativePointerPosition instead of getPointerPosition as it respects the Stage current scale
      const { x, y } = event.target.getStage()!.getRelativePointerPosition()!;
      if (x != null && y != null) {
        setNewAnnotation([{ x, y, width: 0, height: 0 }]);
      }
    }
  };

  const rectHandleMouseMove = (event: KonvaEventObject<WheelEvent>) => {
    if (newAnnotation.length === 1 && isDrawing) {
      const sx = newAnnotation[0].x || 0;
      const sy = newAnnotation[0].y || 0;
      const { x, y } = event.target.getStage()!.getRelativePointerPosition()!;
      if (x != null && y != null) {
        setNewAnnotation([
          {
            x: sx,
            y: sy,
            width: x - sx,
            height: y - sy,
            ...config,
          },
        ]);
      }
    }
  };

  let rects = [...annotations, ...newAnnotation];

  const rectHandleMouseUp = (event: KonvaEventObject<WheelEvent>) => {
    if (newAnnotation.length === 1 && isDrawing) {
      const sx = newAnnotation[0].x || 0;
      const sy = newAnnotation[0].y || 0;
      const { x, y } = event.target.getStage()!.getRelativePointerPosition()!;
      if (x != null && y != null) {
        const annotationToAdd = {
          x: sx,
          y: sy,
          width: x - sx,
          height: y - sy,
          ...config,
        };

        dispatch(
          addInstance(selectedLayerId, {
            visible: true,
            id: _.uniqueId(),
            shapes: [annotationToAdd],
          })
        );

        setNewAnnotation([]);
        setAnnotations([]);
        rects = [];
      }
    }
  };

  return {
    rectHandleDragStart,
    rectHandleDragEnd,
    rectHandleMouseDown,
    rectHandleMouseUp,
    rectHandleMouseMove,
    rects,
  };
};

export default useRect;
