import { Tool, TOOLS } from 'src/constants';
import { KonvaEventObject } from 'konva/lib/Node';
import useRect from './useRect';
import useCursor from './useCursor';
import useEraser from './useEraser';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import {
  endDrawing,
  setPreview,
  startDrawing,
} from 'src/redux/slices/editor/editor.actions';
import useLine from './useLine';
import Konva from 'konva';
import { useRef, useState } from 'react';
import { SelectChangeEvent } from '@mui/material';

const useDraw = (
  selectedLayerId: number,
  selectedLayerColor: string,
  workspaceRef: React.RefObject<HTMLDivElement>,
  stageRef: React.RefObject<Konva.Stage>,
  currentTool: Tool
) => {
  const dispatch = useAppDispatch();
  const updateCount = useRef(0);
  const [tooltip, setTooltip] = useState({
    x: 0,
    y: 0,
    text: '',
    fontSize: 14,
    fill: 'rgba(0,0,0,1)',
    fontFamily: 'Calibri',
    rectWidth: 40,
  });

  // State
  const { isDrawing, layers } = useAppSelector(({ editor }) => editor);

  // Cursor
  const { setCursorStyle } = useCursor(workspaceRef);

  // Rectangle
  const { rectHandleMouseDown, rectHandleMouseUp, rectHandleMouseMove, rects } =
    useRect(selectedLayerId, selectedLayerColor);

  // Line
  const { lineHandleMouseDown, lineHandleMouseUp, lineHandleMouseMove, lines } =
    useLine(selectedLayerId, selectedLayerColor);

  // Eraser
  const {
    eraseHandleMouseDown,
    eraseHandleMouseUp,
    eraseHandleMouseMove,
    eraserLines,
  } = useEraser(selectedLayerId, selectedLayerColor);

  // Update workspace preview
  const updatePreview = (forceUpdate: boolean) => {
    if (forceUpdate || updateCount.current === 0) {
      updateCount.current = updateCount.current + 1;
      const SCALE = 1 / 4;
      const src = stageRef?.current?.toDataURL({ pixelRatio: SCALE });
      if (src) dispatch(setPreview({ src }));
    }
  };

  updatePreview(false);

  /* 
      >>> Workspace events handlers
  */

  const handleMouseDown = (e: KonvaEventObject<WheelEvent>) => {
    if (currentTool === TOOLS.RECTANGLE) {
      return rectHandleMouseDown(e);
    }
    if (currentTool === TOOLS.ERASER) {
      return eraseHandleMouseDown(e);
    }
    if (currentTool === TOOLS.LINE) {
      return lineHandleMouseDown(e);
    }
  };

  const handleMouseUp = (e: KonvaEventObject<WheelEvent>) => {
    updatePreview(true);

    if (currentTool === TOOLS.RECTANGLE) {
      return rectHandleMouseUp(e);
    }
    if (currentTool === TOOLS.ERASER) {
      return eraseHandleMouseUp(e);
    }
    if (currentTool === TOOLS.LINE) {
      return lineHandleMouseUp();
    }
  };
  const handleMouseMove = (e: KonvaEventObject<WheelEvent>) => {
    if (currentTool === TOOLS.RECTANGLE) {
      return rectHandleMouseMove(e);
    }
    if (currentTool === TOOLS.ERASER) {
      return eraseHandleMouseMove(e);
    }
    if (currentTool === TOOLS.LINE) {
      return lineHandleMouseMove(e);
    }
  };

  const handleMouseEnter = () => {
    if (rects.length === 0 && currentTool === TOOLS.SELECT) {
      dispatch(endDrawing());
    }
  };

  const handleMouseLeave = () => {
    if (rects.length === 0 && !isDrawing) {
      setCursorStyle();
      dispatch(startDrawing());
    }
  };

  const showTooltip = (e: any) => {
    const layerTitle: string = e.target?.attrs?.layer;
    const { x, y, type, points, stroke, fill } = e.target.attrs;

    if (
      typeof layerTitle === 'string' &&
      typeof x === 'number' &&
      typeof y === 'number'
    ) {
      let actualX = x;
      let actualY = y;
      if (type === TOOLS.LINE) {
        //points odd indexes are the x values and the even ones are for the y ones
        const xArr: number[] = [];
        const yArr: number[] = [];
        points.forEach((point: number, i: number) => {
          if (i % 2 === 0) return xArr.push(point);
          yArr.push(point);
        });

        // when line moves, the points values will be the same, but the displacement will be represented in `x` and `y` values
        // actualX = Math.min(...xArr) + x;
        const minY = Math.min(...yArr);
        const minYIndex = yArr.indexOf(minY);
        const correspondX = xArr[minYIndex];
        const correspondXIndex = xArr.indexOf(correspondX);
        //we want x that is correspondent to minY
        actualX = points[correspondXIndex + minYIndex];
        actualX = actualX + x;
        actualY = minY + y;
      }

      const rectWidth =
        e.evt?.srcElement?.getContext('2d')?.measureText(layerTitle)?.width *
          1.4 +
          10 || 40;

      setTooltip((prev) => ({
        ...prev,
        x: actualX,
        y: actualY - 30,
        text: layerTitle,
        fill: 'rgba(255,255,255,1)',
        rectWidth,
      }));
    } else {
      setTooltip((prev) => ({ ...prev, text: '' }));
    }
  };

  const hideShapeTemporarily = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target.attrs?.fill) {
      e.target.attrs.fill =
        e.target.attrs.fill === 'rgba(0,0,0,0)'
          ? layers[selectedLayerId].color
              .replace(')', ', 0.3)')
              .replace('rgb', 'rgba')
          : 'rgba(0,0,0,0)';
    }
  };

  return {
    rects,
    eraserLines,
    lines,
    tooltip,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    showTooltip,
    hideShapeTemporarily,
  };
};

export default useDraw;
