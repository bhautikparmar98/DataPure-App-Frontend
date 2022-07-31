import { KonvaEventObject } from 'konva/lib/Node';
import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Star, Text } from 'react-konva';
import useTool from 'src/components/Editor/hooks/useTool';
import BackgroundImage from './BackgroundImage';
import useZoom from 'src/components/Editor/hooks/useZoom';
import Konva from 'konva';

const TOOLBAR_WIDTH = 70;
const MASKS_PANEL_HEIGHT = 60;
const WIDTH = window.innerWidth - TOOLBAR_WIDTH;
const HEIGHT = window.innerHeight - MASKS_PANEL_HEIGHT;

function generateShapes() {
  return [...Array(10)].map((_, i) => ({
    id: i.toString(),
    x: Math.random() * WIDTH,
    y: Math.random() * HEIGHT,
    rotation: Math.random() * 180,
    isDragging: false,
  }));
}

const INITIAL_STATE = generateShapes();

const Workspace = () => {
  const [stars, setStars] = useState(INITIAL_STATE);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);

  const { setCursorStyle } = useTool(workspaceRef);

  const { stageScale, handleWheel } = useZoom();

  const handleDragStart = (e: KonvaEventObject<DragEvent>) => {
    const id = e.target.id();
    setCursorStyle('grab');
    setStars(
      stars.map((star) => {
        return {
          ...star,
          isDragging: star.id === id,
        };
      })
    );
  };
  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    setStars(
      stars.map((star) => {
        return {
          ...star,
          isDragging: false,
        };
      })
    );
    setCursorStyle();
  };

  return (
    <div ref={workspaceRef}>
      <Stage
        width={WIDTH}
        height={HEIGHT}
        ref={stageRef}
        onWheel={handleWheel}
        scaleX={stageScale.stageScale}
        scaleY={stageScale.stageScale}
        x={stageScale.stageX}
        y={stageScale.stageY}
      >
        <Layer>
          <BackgroundImage width={WIDTH} height={HEIGHT} url="/images/1.png" />
          <Text text="Try to drag a star" draggable />
          {stars.map((star) => (
            <Star
              key={star.id}
              id={star.id}
              x={star.x}
              y={star.y}
              numPoints={5}
              innerRadius={20}
              outerRadius={40}
              fill="#89b717"
              opacity={0.8}
              draggable
              rotation={star.rotation}
              shadowColor="black"
              shadowBlur={10}
              shadowOpacity={0.6}
              shadowOffsetX={star.isDragging ? 10 : 5}
              shadowOffsetY={star.isDragging ? 10 : 5}
              scaleX={star.isDragging ? 1.2 : 1}
              scaleY={star.isDragging ? 1.2 : 1}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onMouseEnter={() => setCursorStyle('grab')}
              onMouseLeave={() => setCursorStyle()}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default Workspace;
