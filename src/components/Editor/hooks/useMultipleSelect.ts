import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import { setMultiselectAnnotators } from 'src/redux/slices/classes/classes.slice';
import { useSelect } from '@mui/base';
import useSelectShape from './useSelectShape';
import useTooltip from './useTooltip';





const useMultipleSelect = (bgWidthScale: number, bgHeightScale: number) => {

  const stageRef = useRef<Konva.Stage>(null);

  const { tooltip, showTooltip, hideTooltip } = useTooltip(stageRef);

  const [selectArea, setSelectArea] = useState<Konva.ShapeConfig[]>([]);

  const dispatch = useDispatch();

  const classes = useSelector((state: RootState) => state.classes.classes);

  const multiselectedAnnotatorsArray: any = [];
  const multiselectShapeIds: any = [];

  const handleMultipleSelectMouseDown = useCallback((event: KonvaEventObject<WheelEvent>) => {

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
      setSelectArea([
        {
          stroke: "rgb(205, 209, 228)",
          x: x + bgX,
          y: y + bgY,
          width: 0,
          height: 0,
        },
      ]);
    }

  }, [selectArea])

  const handleMultipleSelectMouseMove = useCallback((event: KonvaEventObject<WheelEvent>) => {
    if (selectArea.length === 1) {
      const sx = selectArea[0].x || 0;
      const sy = selectArea[0].y || 0;
      const { x, y } = event.target.getStage()!.getRelativePointerPosition()!;
      const width = x - sx;
      const height = y - sy;

      const bg = event.target.getStage()?.find('#canvasBackground');

      if (!bg || bg.length === 0) {
        return;
      }
      const { x: mouseX, y: mouseY } = bg[0].getRelativePointerPosition();

      let { width: bgWidth, height: bgHeight } = bg[0].attrs;
      const xValid = mouseX >= 0 && mouseX <= bgWidth;
      const yValid = mouseY >= 0 && mouseY <= bgHeight;

      if (xValid && yValid) {
        setSelectArea([
          {
            stroke: "rgb(205, 209, 228)",
            x: sx,
            y: sy,
            width,
            height,
          },
        ]);
      }
    }
  }, [selectArea])

  let Area = [...selectArea]

  const handleMultipleSelectMouseUp = (event: KonvaEventObject<WheelEvent>) => {
    if (selectArea.length === 1) {
      const sx = selectArea[0].x!;
      const sy = selectArea[0].y!;
      const { x, y } = event.target.getStage()!.getRelativePointerPosition()!;

      const bg = event.target.getStage()?.find('#canvasBackground')!;
      // if (!bg || bg.length === 0) return;
      const { x: bgX, y: bgY, width: bgWidth, height: bgHeight } = bg[0].attrs;

      // mouse position relative to background origin(x,y)
      const { x: mouseX, y: mouseY } = bg[0].getRelativePointerPosition();

      const xValid = mouseX >= 0 && mouseX <= bgWidth;
      const yValid = mouseY >= 0 && mouseY < bgHeight;

      const width = (x - sx) / bgWidthScale
      const height = (y - sy) / bgHeightScale

      const x1 = (sx - bgX) / bgWidthScale
      const x2 = x1 + width
      const y1 = (sy - bgY) / bgHeightScale
      const y2 = y1 + height

      if (xValid && yValid) {
        classes.forEach(({ annotations, name }) => {
          annotations.forEach(({ id, classId, shapes }) => {
            const shapeData = shapes[0]
            if (shapeData.type == "Rectangle") {
              const anno_x1 = shapeData.x
              const anno_x2 = anno_x1 + shapeData.width
              const anno_y1 = shapeData.y
              const anno_y2 = anno_y1 + shapeData.height
              if (x1 < anno_x1 && x2 > anno_x2 && y1 < anno_y1 && y2 > anno_y2) {
                multiselectedAnnotatorsArray.push({ id: id, classId: classId, shapeId: shapeData.id, className: name })
                multiselectShapeIds.push(shapeData.id)
              }
            }
            if (shapeData.type == "Line") {
              if (sx < shapeData.points[0] && sy < shapeData.points[1] && x > shapeData.points[2] && y > shapeData.points[3]) {
                multiselectedAnnotatorsArray.push({ id: id, classId: classId, shapeId: shapeData.id, className: name })
                multiselectShapeIds.push(shapeData.id)
              }
            }
          })
        })
        dispatch(setMultiselectAnnotators({ multiselectedAnnotatorsArray }))
        setSelectArea([]);
        // setAnnotations([]);
        Area = [];
      }
    }
  }

  return {
    handleMultipleSelectMouseDown,
    handleMultipleSelectMouseMove,
    handleMultipleSelectMouseUp,
    Area
  }
}

export default useMultipleSelect;