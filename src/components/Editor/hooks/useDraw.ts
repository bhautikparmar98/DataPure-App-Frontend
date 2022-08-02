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

// const DEBOUNCE_WAIT = 300;

const useDraw = (
  selectedLayerId: number,
  selectedLayerColor: string,
  workspaceRef: React.RefObject<HTMLDivElement>,
  currentTool: Tool
) => {
  const dispatch = useAppDispatch();

  const isDrawing = useAppSelector(({ editor }) => editor.isDrawing);

  const { rectHandleMouseDown, rectHandleMouseUp, rectHandleMouseMove, rects } =
    useRect(selectedLayerId, selectedLayerColor, workspaceRef);

  const {
    eraseHandleMouseDown,
    eraseHandleMouseUp,
    eraseHandleMouseMove,
    eraserLines,
  } = useEraser(selectedLayerId, selectedLayerColor);

  const { setCursorStyle } = useTool(workspaceRef);

  let handleMouseDown = (e: KonvaEventObject<WheelEvent>) => {};
  let handleMouseUp = (e: KonvaEventObject<WheelEvent>) => {};
  let handleMouseMove = (e: KonvaEventObject<WheelEvent>) => {};

  // !TODO: Enhance this part
  if (currentTool === TOOLS.RECTANGLE) {
    handleMouseDown = (e) => rectHandleMouseDown(e);
    handleMouseUp = (e) => rectHandleMouseUp(e);
    handleMouseMove = (e) => rectHandleMouseMove(e);
  } else if (currentTool === TOOLS.ERASER) {
    handleMouseDown = (e) => eraseHandleMouseDown(e);
    handleMouseUp = (e) => eraseHandleMouseUp(e);
    handleMouseMove = (e) => eraseHandleMouseMove(e);
  }

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

  return {
    rects,
    eraserLines,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,

    handleMouseEnter,
    handleMouseLeave,
  };
};

export default useDraw;
