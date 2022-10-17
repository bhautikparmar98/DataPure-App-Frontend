import { KonvaEventObject } from 'konva/lib/Node';
import { Tool, TOOLS } from 'src/constants';
import Konva from 'konva';
import _ from 'lodash';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAnnotation } from 'src/redux/slices/classes/classes.slice';
import useComment from './useComment';
import useLine from './useLine';
import useRect from './useRect';
import { RootState } from 'src/redux/store';

const getNewShapeMove = (
  e: any,
  group: any,
  bgWidthScale: number,
  bgHeightScale: number
) => {
  const shape = _.cloneDeep(group);
  let shapes = [];

  if (shape.type === TOOLS.LINE) {
    // line
    let { points } = e.target.attrs;
    const { x = 0, y = 0 } = e.target.attrs;
    points = points.map((point: number, i: number) => {
      if (i % 2 === 0) return point + x;
      return point + y;
    });
    shape.points = points;

    shapes = [{ ...shape }];
    return shapes;
  } else {
    const bg = e.target.getStage()?.find('#canvasBackground');
    if (!bg || bg.length === 0) return;
    const { x: bgX, y: bgY } = bg[0].attrs;

    const { x, y } = e.target.children[0]?.getClientRect({
      relativeTo: e.target,
    });
    if (typeof x !== 'number') return;
    const { x: shapeX, y: shapeY } = e.target.attrs;

    //remove background scaling from x,y values before saving them in redux state. We don't save such values with the scale as they are different according to the user screen
    shape.x = (shapeX + x - bgX + 0.5) / bgWidthScale;
    shape.y = (shapeY + y - bgY + 0.5) / bgHeightScale;
    shapes = [{ ...shape }];
    e.target.children[0].destroy();
    return shapes;
  }
};

const useDraw = (
  selectedClassIndex: number,
  classId: string,
  selectedClassColor: string,
  stageRef: React.RefObject<Konva.Stage>,
  bgLayerRef: React.RefObject<Konva.Layer>,
  currentTool: Tool,
  backgroundWidth: number,
  bgWidthScale: number,
  bgHeightScale: number,
  onAddComment: (text: string, x: number, y: number) => void,
  onDeleteComment: (commentId: string) => void,
  preAnnotation: any
) => {
  const dispatch = useDispatch();
  const stageDragging = useSelector(
    (state: RootState) => state.editor.stageDragging
  );

  // Rectangle
  const { rectHandleMouseDown, rectHandleMouseUp, rectHandleMouseMove, rects } =
    useRect(
      selectedClassIndex,
      classId,  
      selectedClassColor, 
      bgWidthScale,
      bgHeightScale,
      preAnnotation
    );

  // Line
  const { lineHandleMouseDown, lineHandleMouseUp, lineHandleMouseMove, lines } =
    useLine(selectedClassIndex, classId, selectedClassColor, preAnnotation);

  const { handleComment, handleCommentClick, comments } = useComment(
    bgLayerRef,
    currentTool,
    backgroundWidth,
    onAddComment,
    onDeleteComment
  );

  const handleMouseDown = useCallback(
    (e: KonvaEventObject<WheelEvent>) => {
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
    },
    [stageDragging, currentTool, rects.length, lines.length]
  );

  const handleMouseUp = useCallback(
    (e: KonvaEventObject<WheelEvent>) => {
      if (stageDragging) return;

      // updatePreview(true);

      if (currentTool === TOOLS.RECTANGLE) {
        return rectHandleMouseUp(e);
      }

      if (currentTool === TOOLS.LINE) {
        return lineHandleMouseUp();
      }
    },
    [stageDragging, currentTool, rects.length, lines.length]
  );
  const handleMouseMove = useCallback(
    (e: KonvaEventObject<WheelEvent>) => {
      if (stageDragging) return;
      if (currentTool === TOOLS.RECTANGLE) {
        rectHandleMouseMove(e);
        return;
      }

      if (currentTool === TOOLS.LINE) {
        lineHandleMouseMove(e);
        return;
      }
    },
    [stageDragging, currentTool, rects.length, lines.length]
  );

  // !Todo: We are not limiting users from moving shapes out of the background area
  const handleShapeMove = useCallback(
    (e: any, classId: number, group: any, annotationId: string) => {
      if (stageDragging || !stageRef.current) return;
      const shapes = getNewShapeMove(e, group, bgWidthScale, bgHeightScale);
      if (!shapes) return;
      dispatch(
        updateAnnotation({
          classId,
          annotationId,
          update: { shapes },
        })
      );
    },
    [stageRef, stageDragging, currentTool]
  );

  return {
    rects,
    lines,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    comments,
    handleCommentClick,
    handleShapeMove,
    rectHandleMouseDown,
    rectHandleMouseUp,
    rectHandleMouseMove,
    lineHandleMouseDown,
    lineHandleMouseUp,
    lineHandleMouseMove,
  };
};

export default useDraw;
