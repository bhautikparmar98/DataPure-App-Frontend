import { Tool, TOOLS } from 'src/constants';
import { KonvaEventObject } from 'konva/lib/Node';
import useRect from './useRect';
import useTool from './useTool';
import useEraser from './useEraser';

// const DEBOUNCE_WAIT = 300;

const useDraw = (
  selectedLayerId: number,
  selectedLayerColor: string,
  workspaceRef: React.RefObject<HTMLDivElement>,
  currentTool: Tool
) => {
  const {
    rectHandleDragStart,
    rectHandleDragEnd,
    rectHandleMouseDown,
    rectHandleMouseUp,
    rectHandleMouseMove,
    rects,
  } = useRect(selectedLayerId, selectedLayerColor, workspaceRef);

  const {
    eraseHandleMouseDown,
    eraseHandleMouseUp,
    eraseHandleMouseMove,
    erasedParts,
  } = useEraser(selectedLayerId, selectedLayerColor, workspaceRef);

  const { setCursorStyle } = useTool(workspaceRef);

  let handleMouseDown = (e: KonvaEventObject<WheelEvent>) => {};
  let handleMouseUp = (e: KonvaEventObject<WheelEvent>) => {};
  let handleMouseMove = (e: KonvaEventObject<WheelEvent>) => {};
  let handleDragStart = (e: KonvaEventObject<WheelEvent>) => {};
  let handleDragEnd = (e: KonvaEventObject<WheelEvent>) => {};

  // console.log(currentTool);
  if (currentTool === TOOLS.RECTANGLE) {
    handleMouseDown = (e) => rectHandleMouseDown(e);
    handleMouseUp = (e) => rectHandleMouseUp(e);
    handleMouseMove = (e) => rectHandleMouseMove(e);
    handleDragStart = (e: KonvaEventObject<WheelEvent>) => rectHandleDragStart;
    handleDragEnd = (e: KonvaEventObject<WheelEvent>) => rectHandleDragEnd;
  } else if (currentTool === TOOLS.ERASER) {
    handleMouseDown = (e) => eraseHandleMouseDown(e);
    handleMouseUp = (e) => eraseHandleMouseUp(e);
    handleMouseMove = (e) => eraseHandleMouseMove(e);
  }

  const handleMouseEnter = () => {
    setCursorStyle('move');
  };

  const handleMouseLeave = () => {
    setCursorStyle();
  };

  return {
    rects,
    erasedParts,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleDragStart,
    handleDragEnd,
    handleMouseEnter,
    handleMouseLeave,
  };
};

export default useDraw;
