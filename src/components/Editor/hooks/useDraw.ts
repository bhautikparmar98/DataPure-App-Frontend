import { Tool, TOOLS } from 'src/constants';
import { KonvaEventObject } from 'konva/lib/Node';
import useRect from './useRect';
import useTool from './useTool';
import useEraser from './useEraser';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import {
  endDrawing,
  startDrawing,
} from 'src/redux/slices/editor/editor.actions';
import useLine from './useLine';

const useDraw = (
  selectedLayerId: number,
  selectedLayerColor: string,
  workspaceRef: React.RefObject<HTMLDivElement>,
  currentTool: Tool
) => {
  const dispatch = useAppDispatch();

  const { isDrawing, layers } = useAppSelector(({ editor }) => editor);

  const { rectHandleMouseDown, rectHandleMouseUp, rectHandleMouseMove, rects } =
    useRect(selectedLayerId, selectedLayerColor, workspaceRef);

  const { lineHandleMouseDown, lineHandleMouseUp, lineHandleMouseMove, lines } =
    useLine(selectedLayerId, selectedLayerColor);

  const {
    eraseHandleMouseDown,
    eraseHandleMouseUp,
    eraseHandleMouseMove,
    eraserLines,
  } = useEraser(selectedLayerId, selectedLayerColor);

  const { setCursorStyle } = useTool(workspaceRef);

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
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    hideShapeTemporarily,
  };
};

export default useDraw;
