import Konva from 'konva';
import { useCallback, useState } from 'react';
import { KonvaEventObject } from 'konva/lib/Node';
import { addInstance } from 'src/redux/slices/layers/layers.actions';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { TOOLS } from 'src/constants';
import uniqid from 'uniqid';

const useRect = (selectedLayerId: number, selectedLayerColor: string) => {
  const { isDrawing, tool } = useAppSelector(({ editor }) => editor);
  const dispatch = useAppDispatch();
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
  } as const;

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
          id: uniqid(),
        };

        //min width & height
        if (x - sx > 5 && y - sy > 5) {
          dispatch(
            addInstance(selectedLayerId, {
              visible: true,
              id: uniqid(),
              shapes: [[{ ...annotationToAdd }]],
            })
          );
        }

        setNewAnnotation([]);
        setAnnotations([]);
        rects = [];
      }
    }
  };

  return {
    rectHandleMouseDown,
    rectHandleMouseUp,
    rectHandleMouseMove,
    rects,
  };
};

export default useRect;
