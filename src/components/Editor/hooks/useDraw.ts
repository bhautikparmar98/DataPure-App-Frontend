import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useState } from 'react';

import {
  endDrawing,
  startDrawing,
} from 'src/redux/slices/editor/editor.actions';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import _ from 'underscore';
import useTool from './useTool';

// const DEBOUNCE_WAIT = 300;

const useDraw = (
  selectedMaskColor: string,
  workspaceRef: React.RefObject<HTMLDivElement>
) => {
  const isDrawing = useAppSelector(({ editor }) => editor.isDrawing);
  const dispatch = useAppDispatch();

  const { setCursorStyle } = useTool(workspaceRef);

  const [annotations, setAnnotations] = useState<Konva.ShapeConfig[]>([]);
  const [newAnnotation, setNewAnnotation] = useState<Konva.ShapeConfig[]>([]);

  const handleMouseEnter = () => {
    setCursorStyle('move');
  };

  const handleMouseLeave = () => {
    setCursorStyle();
  };

  const handleMouseDown = (event: KonvaEventObject<WheelEvent>) => {
    if (newAnnotation.length === 0 && isDrawing) {
      //using getRelativePointerPosition instead of getPointerPosition as it respects the Stage current scale
      const { x, y } = event.target.getStage()?.getRelativePointerPosition()!;
      setNewAnnotation([{ x, y, width: 0, height: 0 }]);
    }
  };

  const handleMouseUp = (event: KonvaEventObject<WheelEvent>) => {
    if (newAnnotation.length === 1 && isDrawing) {
      const sx = newAnnotation[0].x || 0;
      const sy = newAnnotation[0].y || 0;
      const { x, y } = event.target.getStage()?.getRelativePointerPosition()!;
      const annotationToAdd = {
        x: sx,
        y: sy,
        width: x - sx,
        height: y - sy,
        fill: selectedMaskColor,
      };
      annotations.push(annotationToAdd);
      setNewAnnotation([]);
      setAnnotations(annotations);
    }
  };

  const handleMouseMove = (event: KonvaEventObject<WheelEvent>) => {
    if (newAnnotation.length === 1 && isDrawing) {
      const sx = newAnnotation[0].x || 0;
      const sy = newAnnotation[0].y || 0;
      const { x, y } = event.target.getStage()?.getRelativePointerPosition()!;
      setNewAnnotation([
        {
          x: sx,
          y: sy,
          width: x - sx,
          height: y - sy,
          fill: selectedMaskColor,
        },
      ]);
    }
  };
  let annotationsToDraw = [...annotations, ...newAnnotation];

  const handleDragStart = () => {
    setCursorStyle('move');
    annotationsToDraw = [];
    setNewAnnotation([]);
    dispatch(endDrawing());
  };

  const handleDragEnd = () => {
    setCursorStyle();
    setNewAnnotation([]);
    dispatch(startDrawing());
    annotationsToDraw = [];
  };

  return {
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    annotationsToDraw,
    handleDragStart,
    handleDragEnd,
    handleMouseEnter,
    handleMouseLeave,
  };
};

export default useDraw;
