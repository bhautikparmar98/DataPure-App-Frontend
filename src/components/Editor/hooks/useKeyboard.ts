import Konva from "konva";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { TOOLS } from "src/constants";
import { deleteAnnotation } from "src/redux/slices/classes/classes.slice";
import { startDragging } from "src/redux/slices/editor/editor.slice";
import useCursor from "./useCursor";

const useKeyboard = (
  workspaceRef: React.RefObject<HTMLDivElement>,
  stageRef: React.RefObject<Konva.Stage>,
  selectedId: string
) => {
  const { setCursorStyle } = useCursor(workspaceRef);

  const dispatch = useDispatch();

  const stage = stageRef.current;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!stage) return;

      switch (e.code) {
        case "Space":
          return handlePanTool();
        case "Delete":
        case "Backspace":
          return handleShapeDeletion();

        default:
          break;
      }
    },
    [stage]
  );

  const handlePanTool = useCallback(() => {
    setCursorStyle(`url("/tools/${TOOLS.PAN}.svg"),auto`);
    dispatch(startDragging({ stageDragging: true }));
  }, [stage]);

  const handleShapeDeletion = useCallback(() => {
    if (!stage) return;
    const { classId, annotationId } =
      stage.find("#" + selectedId)[0]?.parent?.attrs || {};
    if (classId >= 0 && annotationId?.length > 0) {
      dispatch(deleteAnnotation({ classId, annotationId }));
    }
  }, [stage]);

  const handleKeyUp = useCallback(() => {
    dispatch(startDragging({ stageDragging: false }));

    setCursorStyle();
  }, [stage]);

  return {
    handleKeyDown,
    handleKeyUp,
  };
};
export default useKeyboard;
