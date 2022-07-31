import Konva from 'konva';
import React, { useState } from 'react';

type Props = {
  stageRef: React.RefObject<Konva.Stage> | undefined;
  onChangePosition: (pos: Konva.Vector2d) => void;
  dragBoundFunc: (pos: Konva.Vector2d) => Konva.Vector2d;
  onChangeScale: (pos: Konva.Vector2d) => Konva.Vector2d;
};

// const MAX_ZOOM = 200;
const SCALE_BY = 1.5;

const useZoom = () => {
  const [stageScale, setStageScale] = useState({
    stageScale: 1,
    stageX: 0,
    stageY: 0,
  });

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const stage = e.target.getStage();
    console.log(stage);
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
      e.evt.deltaY > 0 ? oldScale * SCALE_BY : oldScale / SCALE_BY;

    setStageScale({
      stageScale: newScale,
      stageX: -(mousePointTo.x - pointerPosition.x / newScale) * newScale,
      stageY: -(mousePointTo.y - pointerPosition.y / newScale) * newScale,
    });
  };

  return { stageScale, handleWheel };
};

export default useZoom;
