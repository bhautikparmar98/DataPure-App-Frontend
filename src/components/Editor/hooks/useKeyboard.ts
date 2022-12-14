import Konva from 'konva';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { ROLES, TOOLS } from 'src/constants';
import useAuth from 'src/hooks/useAuth';
import { deleteAnnotation, undoHistory, redoHistory, deleteAnnotations, setMultiselectAnnotators, setChecks } from 'src/redux/slices/classes/classes.slice';
import { startDragging, setTool } from 'src/redux/slices/editor/editor.slice';
import { RootState } from 'src/redux/store';
import useCursor from './useCursor';

const useKeyboard = (
  workspaceRef: React.RefObject<HTMLDivElement>,
  stageRef: React.RefObject<Konva.Stage>,
  selectedId: string
) => {
  const { role } = useAuth();
  const { setCursorStyle } = useCursor(workspaceRef);
  const currentTool = useSelector((state: RootState) => state.editor.tool);
  const dispatch = useDispatch();

  const checks = useSelector((state: RootState) => state.classes.checks);

  const checkedIds : string[] = [];
  for (const [key, checked] of Object.entries(checks)) {
    if (checked) checkedIds.push(key);
  }
 
  const stage = stageRef.current;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.code) {
      case 'Space':
        return handlePanTool();
      case 'Delete':
      case 'Backspace':
        return handleShapeDeletion();
      case 'KeyM':
        return dispatch(setTool({ tool: TOOLS.SELECT }));
      case 'KeyR':
        return dispatch(setTool({ tool: TOOLS.RECTANGLE }));
      case 'KeyL':
        return dispatch(setTool({ tool: TOOLS.LINE }));
      case 'KeyC':
        return dispatch(setTool({ tool: TOOLS.COMMENT }));
      case 'KeyZ':
        if (e.ctrlKey) {
          dispatch(undoHistory());
        }
        break;
      case 'KeyY':
        if (e.ctrlKey) {
          dispatch(redoHistory());
        }
        break;

      default:
        break;
    }
  };

  const handlePanTool = useCallback(() => {
    setCursorStyle(`url("/tools/${TOOLS.PAN}.svg"),auto`);
    dispatch(startDragging({ stageDragging: true }));
  }, [stage]);

  const handleShapeDeletion = useCallback(() => {
    if (!stage) return;
    const multiselectedAnnotatorsArray : any = []
    dispatch(setMultiselectAnnotators({multiselectedAnnotatorsArray}))
    // for multiple selection Delete using keyboard
    if(checkedIds.length > 0){
      const newChecks :any = {}
      dispatch(setChecks({newChecks}))
      dispatch(
        deleteAnnotations({
          annotationIds: checkedIds,
        })
      );
    }
  }, [selectedId, checkedIds]);

  const handleKeyUp = useCallback(() => {
    dispatch(startDragging({ stageDragging: false }));

    setCursorStyle();
  }, [stage, currentTool]);

  return {
    handleKeyDown,
    handleKeyUp,
  };
};
export default useKeyboard;
