import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useState } from 'react';
import { TOOLS } from 'src/constants';
import { addAnnotation } from 'src/redux/slices/classes/classes.actions';
import { useAppDispatch } from 'src/redux/store';
import uniqid from 'uniqid';

const config = {
  opacity: 0.7,
  strokeWidth: 2,
} as const;

const useRect = (
  selectedClassIndex: number,
  classId: string,
  selectedClassColor: string
) => {
  const dispatch = useAppDispatch();
  const [annotations, setAnnotations] = useState<Konva.ShapeConfig[]>([]);
  const [newAnnotation, setNewAnnotation] = useState<Konva.ShapeConfig[]>([]);

  const rectConfig = {
    ...config,
    fill:
      selectedClassColor?.replace(')', ', 0.3)').replace('rgb', 'rgba') ||
      'rgba(0,0,0,0.3)',
    stroke: selectedClassColor,
  };

  const rectHandleMouseDown = (event: KonvaEventObject<WheelEvent>) => {
    if (newAnnotation.length === 0) {
      //using getRelativePointerPosition instead of getPointerPosition as it respects the Stage current scale
      const { x, y } = event.target.getStage()!.getRelativePointerPosition()!;
      if (x != null && y != null) {
        setNewAnnotation([
          {
            ...rectConfig,
            x,
            y,
            width: 0,
            height: 0,
          },
        ]);
      }
    }
  };

  const rectHandleMouseMove = (event: KonvaEventObject<WheelEvent>) => {
    if (newAnnotation.length === 1) {
      const sx = newAnnotation[0].x || 0;
      const sy = newAnnotation[0].y || 0;
      const { x, y } = event.target.getStage()!.getRelativePointerPosition()!;
      if (x != null && y != null) {
        setNewAnnotation([
          {
            ...rectConfig,
            x: sx,
            y: sy,
            width: x - sx,
            height: y - sy,
          },
        ]);
      }
    }
  };

  let rects = [...annotations, ...newAnnotation];

  const rectHandleMouseUp = (event: KonvaEventObject<WheelEvent>) => {
    if (newAnnotation.length === 1) {
      const sx = newAnnotation[0].x || 0;
      const sy = newAnnotation[0].y || 0;
      const { x, y } = event.target.getStage()!.getRelativePointerPosition()!;
      if (x != null && y != null) {
        const annotationToAdd = {
          type: TOOLS.RECTANGLE,
          x: sx,
          y: sy,
          width: x - sx,
          height: y - sy,
          id: uniqid(),
        };

        //min width & height
        if (Math.abs(x - sx) > 5 && Math.abs(y - sy) > 5) {
          dispatch(
            addAnnotation(selectedClassIndex, classId, {
              visible: true,
              id: uniqid(),
              shapes: [{ ...annotationToAdd }],
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
