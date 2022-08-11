import { Instance, Tool, TOOLS } from 'src/constants';
import { KonvaEventObject } from 'konva/lib/Node';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { setPreview } from 'src/redux/slices/editor/editor.actions';
import useRect from './useRect';
import useLine from './useLine';
import useComment from './useComment';
import uniqid from 'uniqid';
// import useEraser from './useEraser';
import Konva from 'konva';
import { useRef } from 'react';
import {
  addInstance,
  deleteInstance,
  updateInstance,
  updateShape,
} from 'src/redux/slices/layers/layers.actions';
import _ from 'lodash';

const useDraw = (
  selectedLayerId: number,
  selectedLayerColor: string,
  workspaceRef: React.RefObject<HTMLDivElement>,
  stageRef: React.RefObject<Konva.Stage>,
  currentTool: Tool
) => {
  const dispatch = useAppDispatch();
  const updateCount = useRef(0);

  // State
  const { layers } = useAppSelector(({ layers }) => layers);

  // Rectangle
  const { rectHandleMouseDown, rectHandleMouseUp, rectHandleMouseMove, rects } =
    useRect(selectedLayerId, selectedLayerColor);

  // Line
  const { lineHandleMouseDown, lineHandleMouseUp, lineHandleMouseMove, lines } =
    useLine(selectedLayerId, selectedLayerColor);

  const { handleComment, handleCommentClick, comments } = useComment(
    stageRef,
    currentTool
  );

  // Eraser
  // const {
  //   eraseHandleMouseDown,
  //   eraseHandleMouseUp,
  //   eraseHandleMouseMove,
  //   eraserLines,
  // } = useEraser(selectedLayerId, selectedLayerColor);

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
    // if (currentTool === TOOLS.ERASER) {
    //   return eraseHandleMouseDown(e);
    // }
    if (currentTool === TOOLS.LINE) {
      return lineHandleMouseDown(e);
    }
    if (currentTool === TOOLS.COMMENT) {
      return handleComment(e);
    }
  };

  const handleMouseUp = (e: KonvaEventObject<WheelEvent>) => {
    updatePreview(true);

    if (currentTool === TOOLS.RECTANGLE) {
      return rectHandleMouseUp(e);
    }
    // if (currentTool === TOOLS.ERASER) {
    //   return eraseHandleMouseUp(e);
    // }
    if (currentTool === TOOLS.LINE) {
      return lineHandleMouseUp();
    }
  };
  const handleMouseMove = (e: KonvaEventObject<WheelEvent>) => {
    if (currentTool === TOOLS.RECTANGLE) {
      return rectHandleMouseMove(e);
    }
    // if (currentTool === TOOLS.ERASER) {
    //   return eraseHandleMouseMove(e);
    // }
    if (currentTool === TOOLS.LINE) {
      return lineHandleMouseMove(e);
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

  const handleShapeMove = (
    e: any,
    layerId: number,
    group: any,
    instanceId: string
  ) => {
    if (stageRef.current) {
      const shape = _.cloneDeep(group[0]);
      if (shape.type === TOOLS.LINE) {
        let { points } = e.target.attrs;
        const { x = 0, y = 0 } = e.target.attrs;
        points = points.map((point: number, i: number) => {
          if (i % 2 === 0) return point + x;
          return point + y;
        });
        shape.points = points;
      } else {
        const { x, y } = e.target.children[0].getClientRect({
          relativeTo: e.target,
        });
        const { x: shapeX, y: shapeY } = e.target.attrs;

        shape.x = shapeX + x;
        shape.y = shapeY + y;
      }
      dispatch(updateInstance(layerId, instanceId, shape));
    }
  };

  return {
    rects,
    // eraserLines,
    lines,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    hideShapeTemporarily,
    comments,
    handleCommentClick,
    handleShapeMove,
  };
};

export default useDraw;
