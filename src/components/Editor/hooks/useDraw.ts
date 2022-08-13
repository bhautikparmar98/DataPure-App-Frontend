import { KonvaEventObject } from 'konva/lib/Node';
import { Tool, TOOLS } from 'src/constants';
// import { setPreview } from 'src/redux/slices/editor/editor.actions';
import Konva from 'konva';
import _ from 'lodash';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import useComment from './useComment';
import useLine from './useLine';
import useRect from './useRect';
// import { useRef } from 'react';
import { updateAnnotation } from 'src/redux/slices/classes/classes.actions';

const useDraw = (
  selectedClassId: number,
  selectedClassColor: string,
  stageRef: React.RefObject<Konva.Stage>,
  currentTool: Tool,
  stageDragging: boolean
) => {
  const dispatch = useAppDispatch();
  // const updateCount = useRef(0);

  // State
  const { classes } = useAppSelector(({ classes }) => classes);

  // Rectangle
  const { rectHandleMouseDown, rectHandleMouseUp, rectHandleMouseMove, rects } =
    useRect(selectedClassId, selectedClassColor);

  // Line
  const { lineHandleMouseDown, lineHandleMouseUp, lineHandleMouseMove, lines } =
    useLine(selectedClassId, selectedClassColor);

  const { handleComment, handleCommentClick, comments } = useComment(
    stageRef,
    currentTool
  );

  // Update workspace preview
  // const updatePreview = (forceUpdate: boolean) => {
  //   if (forceUpdate || updateCount.current === 0) {
  //     updateCount.current = updateCount.current + 1;
  //     const SCALE = 1 / 4;
  //     const src = stageRef?.current?.toDataURL({ pixelRatio: SCALE });
  //     if (src) dispatch(setPreview({ src }));
  //   }
  // };

  // updatePreview(false);

  /* 
      >>> Workspace events handlers
  */

  const handleMouseDown = (e: KonvaEventObject<WheelEvent>) => {
    if (stageDragging) return;
    if (currentTool === TOOLS.RECTANGLE) {
      return rectHandleMouseDown(e);
    }

    if (currentTool === TOOLS.LINE) {
      return lineHandleMouseDown(e);
    }
    if (currentTool === TOOLS.COMMENT) {
      return handleComment(e);
    }
  };

  const handleMouseUp = (e: KonvaEventObject<WheelEvent>) => {
    if (stageDragging) return;

    // updatePreview(true);

    if (currentTool === TOOLS.RECTANGLE) {
      return rectHandleMouseUp(e);
    }

    if (currentTool === TOOLS.LINE) {
      return lineHandleMouseUp();
    }
  };
  const handleMouseMove = (e: KonvaEventObject<WheelEvent>) => {
    if (stageDragging) return;
    if (currentTool === TOOLS.RECTANGLE) {
      return rectHandleMouseMove(e);
    }

    if (currentTool === TOOLS.LINE) {
      return lineHandleMouseMove(e);
    }
  };

  const hideShapeTemporarily = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target.attrs?.fill) {
      e.target.attrs.fill =
        e.target.attrs.fill === 'rgba(0,0,0,0)'
          ? classes[selectedClassId].color
              .replace(')', ', 0.3)')
              .replace('rgb', 'rgba')
          : 'rgba(0,0,0,0)';
    }
  };

  const handleShapeMove = (
    e: any,
    classId: number,
    group: any,
    annotationId: string
  ) => {
    if (stageDragging || !stageRef.current) return;
    const shape = _.cloneDeep(group);
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
    dispatch(updateAnnotation(classId, annotationId, shape));
  };

  return {
    rects,
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
