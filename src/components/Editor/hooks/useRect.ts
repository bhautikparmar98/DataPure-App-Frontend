import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useState, useCallback } from 'react';
import { TOOLS } from 'src/constants';
import { addAnnotation } from 'src/redux/slices/classes/classes.slice';
import { useDispatch } from 'react-redux';
import uniqid from 'uniqid';
// const config = {
//   opacity: 0.8,
//   strokeWidth: 2,
// } as const;

const useRect = (
  selectedClassIndex: number,
  classId: string,
  selectedClassColor: string,
  bgWidthScale: number,
  bgHeightScale: number
) => {
  const dispatch = useDispatch();
  // const [annotations, setAnnotations] = useState<Konva.ShapeConfig[]>([]);
  const [newAnnotation, setNewAnnotation] = useState<Konva.ShapeConfig[]>([]);

  const rectHandleMouseDown = useCallback(
    (event: KonvaEventObject<WheelEvent>) => {
      if (newAnnotation.length === 0) {
        //using getRelativePointerPosition instead of getPointerPosition as it respects the Stage current scale
        // const { x, y } = event.target.getStage()!.getRelativePointerPosition()!;
        const bg = event.target.getStage()?.find('#canvasBackground')!;
        // if (!bg || bg.length === 0) return;

        let { x, y } = bg[0].getRelativePointerPosition()!;

        // We are getting the values of the x & y relative to the background coords as the background might have different coords in different user screens
        let { x: bgX, y: bgY, width: bgWidth, height: bgHeight } = bg[0].attrs;

        // mouse position relative to background origin(x,y)
        const { x: mouseX, y: mouseY } = bg[0].getRelativePointerPosition();

        const xValid = mouseX >= 0 && mouseX <= bgWidth;
        const yValid = mouseY >= 0 && mouseY <= bgHeight;

        if (xValid && yValid) {
          setNewAnnotation([
            {
              stroke: selectedClassColor,
              x: x + bgX,
              y: y + bgY,
              width: 0,
              height: 0,
            },
          ]);
        }
      }
    },
    [newAnnotation]
  );

  const rectHandleMouseMove = useCallback(
    (event: KonvaEventObject<WheelEvent>) => {
      if (newAnnotation.length === 1) {
        const sx = newAnnotation[0].x || 0;
        const sy = newAnnotation[0].y || 0;
        let { x, y } = event.target.getStage()!.getRelativePointerPosition()!;
        const width = x - sx;
        const height = y - sy;

        const bg = event.target.getStage()?.find('#canvasBackground');
        if (!bg || bg.length === 0) return;

        const { x: mouseX, y: mouseY } = bg[0].getRelativePointerPosition();

        let { width: bgWidth, height: bgHeight } = bg[0].attrs;
        const xValid = mouseX >= 0 && mouseX <= bgWidth;
        const yValid = mouseY >= 0 && mouseY <= bgHeight;

        if (xValid && yValid) {
          setNewAnnotation([
            {
              stroke: selectedClassColor,
              x: sx,
              y: sy,
              width,
              height,
            },
          ]);
        }
      }
    },
    [newAnnotation]
  );

  let rects = [...newAnnotation];

  const rectHandleMouseUp = useCallback(
    (event: KonvaEventObject<WheelEvent>) => {
      if (newAnnotation.length === 1) {
        const sx = newAnnotation[0].x!;
        const sy = newAnnotation[0].y!;
        let { x, y } = event.target.getStage()!.getRelativePointerPosition()!;
        const bg = event.target.getStage()?.find('#canvasBackground')!;
        // if (!bg || bg.length === 0) return;
        const { x: bgX, y: bgY, width: bgWidth, height: bgHeight } = bg[0].attrs;

        // mouse position relative to background origin(x,y)
        const { x: mouseX, y: mouseY } = bg[0].getRelativePointerPosition();

        const xValid = mouseX >= 0 && mouseX <= bgWidth;
        const yValid = mouseY >= 0 && mouseY < bgHeight;

        if (xValid && yValid) {
          const annotationToAdd = {
            type: TOOLS.RECTANGLE,
            // saving x & y without bg (coords & scale) and we will add them later while drawing as these are dynamic values
            x: (sx - bgX) / bgWidthScale,
            y: (sy - bgY) / bgHeightScale,
            width: (x - sx) / bgWidthScale,
            height: (y - sy) / bgHeightScale,
            id: uniqid(),
          };

          //min width & height
          if (Math.abs(x - sx) > 0 && Math.abs(y - sy) > 0) {
            dispatch(
              addAnnotation({
                classIndex: selectedClassIndex,
                classId,
                annotation: {
                  visible: true,
                  id: uniqid(),
                  shapes: [{ ...annotationToAdd }],
                },
              })
            );
          }

          setNewAnnotation([]);
          // setAnnotations([]);
          rects = [];
        }
      }
    },
    [newAnnotation]
  );

  return {
    rectHandleMouseDown,
    rectHandleMouseUp,
    rectHandleMouseMove,
    rects,
  };
};

export default useRect;
