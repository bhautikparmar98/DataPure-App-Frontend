import { KonvaEventObject } from 'konva/lib/Node';
import { Tool, TOOLS } from 'src/constants';
// import { setPreview } from 'src/redux/slices/editor/editor.actions';
import Konva from 'konva';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import useLine from './useLine';
import useRect from './useRect';
// import { useRef } from 'react';
import { useCallback } from 'react';
import { updateAnnotation } from 'src/redux/slices/classes/classes.slice';
import useComment from './useComment';

const useDraw = (
  selectedClassIndex: number,
  classId: string,
  selectedClassColor: string,
  stageRef: React.RefObject<Konva.Stage>,
  bgLayerRef: React.RefObject<Konva.Layer>,
  currentTool: Tool,
  stageDragging: boolean,
  backgroundWidth: number,
  bgWidthScale: number,
  bgHeightScale: number,
  onAddComment: (text: string, x: number, y: number) => void,
  onDeleteComment: (commentId: string) => void
) => {
  const dispatch = useDispatch();
  // const updateCount = useRef(0);

  // Rectangle
  const { rectHandleMouseDown, rectHandleMouseUp, rectHandleMouseMove, rects } =
    useRect(
      selectedClassIndex,
      classId,
      selectedClassColor,
      bgWidthScale,
      bgHeightScale
    );

  // Line
  const { lineHandleMouseDown, lineHandleMouseUp, lineHandleMouseMove, lines } =
    useLine(selectedClassIndex, classId, selectedClassColor);

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

  const hideShapeTemporarily = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (e.target.attrs?.fill) {
        let originalFill = e.target.attrs.originalFill || e.target.attrs.fill;

        e.target.attrs.fill =
          e.target.attrs.fill === 'rgba(0,0,0,0)'
            ? originalFill
            : 'rgba(0,0,0,0)';

        e.target.attrs.originalFill = originalFill;
      }
    },
    []
  );

  //!fix: ClassesPanel rerender with each update and we need to just update properties when shapes move without updating the `classes` reference in state
  // !Todo: We are not limiting users from moving shapes out of the background area
  const handleShapeMove = (
    e: any,
    classId: number,
    group: any,
    annotationId: string
  ) => {
    if (stageDragging || !stageRef.current) return;
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
    } else {
      const bg = e.target.getStage()?.find('#canvasBackground');
      if (!bg || bg.length === 0) return;
      const { x: bgX, y: bgY } = bg[0].attrs;

      const { x, y } = e.target.children[0]?.getClientRect({
        relativeTo: e.target,
      });
      const { x: shapeX, y: shapeY } = e.target.attrs;

      //remove background scaling from x,y values before saving them in redux state. We don't save such values with the scale as they are different according to the user screen
      shape.x = (shapeX + x - bgX) / bgWidthScale;
      shape.y = (shapeY + y - bgY) / bgHeightScale;
      shapes = [{ ...shape }];
      e.target.children[0].destroy();
    }
    dispatch(
      updateAnnotation({
        classId,
        annotationId,
        update: { shapes },
      })
    );
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
    rectHandleMouseDown,
    rectHandleMouseUp,
    rectHandleMouseMove,
    lineHandleMouseDown,
    lineHandleMouseUp,
    lineHandleMouseMove,
  };
};

export default useDraw;
