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
      // const { x, y } = event.target.getStage()!.getRelativePointerPosition()!;
      const bg = event.target.getStage()?.find('#canvasBackground');
      if (!bg || bg.length === 0) return;

      let { x, y } = bg[0].getRelativePointerPosition()!;
      // We are getting the values of the x & y relative to the background coords as the background might have different coords in different user screens
      const { x: bgX, y: bgY, scaleX, scaleY } = bg[0].attrs;

      if (x != null && y != null) {
        setNewAnnotation([
          {
            ...rectConfig,
            x: x + bgX,
            y: y + bgY,
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
      const width = x - sx;
      const height = y - sy;

      const bg = event.target.getStage()?.find('#canvasBackground');
      if (!bg || bg.length === 0) return;
      const { x: bgX, y: bgY, width: bgWidth } = bg[0].attrs;

      // const isValidX = x > bgX ? x + width <= bgX + bgWidth : width - x > bgX;

      if (x != null && y != null) {
        setNewAnnotation([
          {
            ...rectConfig,
            x: sx,
            y: sy,
            width,
            height,
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

      const bg = event.target.getStage()?.find('#canvasBackground');
      if (!bg || bg.length === 0) return;
      const { x: bgX, y: bgY, width, height, scaleX } = bg[0].attrs;

      if (x != null && y != null) {
        const annotationToAdd = {
          type: TOOLS.RECTANGLE,
          // saving x & y without bg coords and we will add them later while drawing as these are dynamic values
          x: sx - bgX,
          y: sy - bgY,
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
