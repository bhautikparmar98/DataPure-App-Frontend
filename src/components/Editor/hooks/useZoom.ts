import Konva from 'konva';
import { useRef, useState } from 'react';
// import { setPreview } from 'src/redux/slices/editor/editor.actions';
// import { useAppDispatch } from 'src/redux/store';

const SCALE_BY = 1.4;
const MIN_SCALE = 0.05;
// const MAX_SCALE = 20;
// const PREVIEW_SCALE = 1 / 4;

const useZoom = () => {
  const [stageScale, setStageScale] = useState({
    stageScale: 1,
    stageX: 0,
    stageY: 0,
  });

  const stageRef = useRef<Konva.Stage | null>(null);

  // const dispatch = useAppDispatch();

  // const updatePreview = _.debounce((stage: Konva.Stage) => {
  //   const src = stage.toDataURL({ pixelRatio: PREVIEW_SCALE });
  //   dispatch(setPreview({ src }));
  // }, 1000);

  // useEffect(() => {
  //   if (stageRef.current) {
  //     updatePreview(stageRef.current);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [stageScale]);

  // We may need to debounce this method for big number of shapes drawn
  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const stage = e.target.getStage();

    if (!stage) return;

    stageRef.current = stage;

    const oldScale = Math.abs(stage.scaleX());

    const newScale =
      e.evt.deltaY < 0 ? oldScale * SCALE_BY : oldScale / SCALE_BY;

    if (newScale < MIN_SCALE) return;

    const pointerPosition = stage.getPointerPosition() as {
      x: number;
      y: number;
    };
    const mousePointTo = {
      x: pointerPosition?.x / oldScale - stage.x() / oldScale,
      y: pointerPosition.y / oldScale - stage.y() / oldScale,
    };

    setStageScale({
      stageScale: newScale,
      stageX: -(mousePointTo.x - pointerPosition.x / newScale) * newScale,
      stageY: -(mousePointTo.y - pointerPosition.y / newScale) * newScale,
    });
  };

  return { stageScale, handleWheel };
};

export default useZoom;
