import { KonvaEventObject } from 'konva/lib/Node';
import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Star, Text } from 'react-konva';
import useTool from 'components/Editor/hooks/useTool';
import BackgroundImage from './children/BackgroundImage';

function generateShapes() {
  return [...Array(10)].map((_, i) => ({
    id: i.toString(),
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    rotation: Math.random() * 180,
    isDragging: false,
  }));
}

const width = window.innerWidth - 70;
const height = window.innerHeight - 5;

const INITIAL_STATE = generateShapes();

const Workspace = () => {
  const workspaceRef = useRef<HTMLDivElement>(null);
  useTool(workspaceRef);
  const [stars, setStars] = useState(INITIAL_STATE);

  const handleDragStart = (e: KonvaEventObject<DragEvent>) => {
    const id = e.target.id();
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
  };

  return (
    <div ref={workspaceRef}>
      <Stage width={width} height={height}>
        <Layer>
          <BackgroundImage width={width} height={height} url="/images/1.png" />
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
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default Workspace;
