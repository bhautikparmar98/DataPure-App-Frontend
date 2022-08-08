import Konva from 'konva';
import { useState } from 'react';
// import { setPreview } from 'src/redux/slices/editor/editor.actions';
// import { useAppDispatch } from 'src/redux/store';

const SCALE_BY = 1.3;
const MIN_SCALE = 0.05;
const MAX_SCALE = 1 / MIN_SCALE;
// const PREVIEW_SCALE = 1 / 4;

const useZoom = () => {
  const [stageScale, setStageScale] = useState({
    stageScale: 1,
    stageX: 0,
    stageY: 0,
  });

  // const dispatch = useAppDispatch();

  const updatePreview = (stage: Konva.Stage) => {
    // const src = stage.toDataURL({ pixelRatio: PREVIEW_SCALE });
    // dispatch(setPreview({ src }));
  };

  // We may need to debounce this method for big number of shapes drawn
  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const stage = e.target.getStage();

    if (!stage) return;

    const oldScale = Math.abs(stage.scaleX());
    const pointerPosition = stage.getPointerPosition() as {
      x: number;
      y: number;
    };
    const mousePointTo = {
      x: pointerPosition?.x / oldScale - stage.x() / oldScale,
      y: pointerPosition.y / oldScale - stage.y() / oldScale,
    };

    const newScale =
      e.evt.deltaY < 0 ? oldScale * SCALE_BY : oldScale / SCALE_BY;

    if (newScale < MIN_SCALE || newScale > MAX_SCALE) return;

    updatePreview(stage);

    setStageScale({
      stageScale: newScale,
      stageX: -(mousePointTo.x - pointerPosition.x / newScale) * newScale,
      stageY: -(mousePointTo.y - pointerPosition.y / newScale) * newScale,
    });
  };

  return { stageScale, handleWheel };
};

export default useZoom;
