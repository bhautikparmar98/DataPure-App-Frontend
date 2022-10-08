import { KonvaEventObject } from 'konva/lib/Node';
import { Stage } from 'konva/lib/Stage';
import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
// import { setPreview } from 'src/redux/slices/editor/editor.actions';
// import { useDispatch } from 'react-redux';

const SCALE_BY = 1.8;
const MIN_SCALE = 0.005;
// const MAX_SCALE = 20;
// const PREVIEW_SCALE = 1 / 4;

const useZoom = () => {
  const [stageScale, setStageScale] = useState({
    stageScale: 1,
    stageX: 0,
    stageY: 0,
  });

  const [zooming, setZooming] = useState(false);

  const stageRef = useRef<Stage | null>(null);

  const updateZoom = useCallback(
    _.debounce(() => {
      if (zooming) setZooming(false);
    }, 1000),
    [zooming]
  );

  useEffect(() => {
    updateZoom();
  }, [stageScale]);

  // We may need to debounce this method for big number of shapes drawn
  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    setZooming(true);
    const stage = e.target.getStage()!;

    // if (!stage) return;

    stageRef.current = stage;

    const oldScale = Math.abs(stage.scaleX());

    const newScale =
      e.evt.deltaY < 0 ? oldScale * SCALE_BY : oldScale / SCALE_BY;

    // if (newScale < MIN_SCALE) return;

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

  return { stageScale, handleWheel, zooming };
};

export default useZoom;
