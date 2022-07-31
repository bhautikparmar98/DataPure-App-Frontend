import { KonvaEventObject } from 'konva/lib/Node';
import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Star, Text, Rect, Line } from 'react-konva';
import useDraw from '../hooks/useDraw';
import BackgroundImage from './BackgroundImage';
import useZoom from 'src/components/Editor/hooks/useZoom';
import Konva from 'konva';
import { useAppSelector } from 'src/redux/store';

const TOOLBAR_WIDTH = 70;
const MASKS_PANEL_HEIGHT = 60;
const WIDTH = window.innerWidth - TOOLBAR_WIDTH;
const HEIGHT = window.innerHeight - MASKS_PANEL_HEIGHT;

const Workspace = () => {
  const [masks, selectedMaskId] = useAppSelector(({ editor }) => [
    editor.masks,
    editor.selectedMaskId,
  ]);

  const workspaceRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const {
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    annotationsToDraw,
    handleDragStart,
    handleDragEnd,
    handleMouseEnter,
    handleMouseLeave,
  } = useDraw(masks[selectedMaskId].color, workspaceRef);

  const masksRef = useRef<Konva.Layer[] | []>([]);

  const { stageScale, handleWheel } = useZoom();

  // Cache Layers: Caching will disable shapes dragging
  // useEffect(() => {
  //   if (stageRef.current?.children) {
  //     masksRef.current = stageRef.current.children.slice(
  //       0,
  //       stageRef.current.children.length - 1
  //     );
  //     masksRef.current.forEach((mask) => {
  //       if (mask.children?.length! > 0) {
  //         console.log(mask);
  //         mask.cache();
  //       }
  //     });
  //   }
  // }, []);

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
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <Layer name="Background Layer">
          <BackgroundImage width={WIDTH} height={HEIGHT} url="/images/1.png" />
        </Layer>
        {masks.map((mask, i) => (
          <Layer
            name={mask.title}
            key={`layer-${mask.title}-${i}`}
            visible={mask.visible}
            // listening={i === selectedMaskId}
          >
            {mask.instances.map((instance) =>
              instance.shapes?.map((shape, m) =>
                shape.width ? (
                  <Rect
                    {...shape}
                    key={`${instance.id}-${m}-rect`}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    draggable
                  />
                ) : (
                  <Line
                    {...shape}
                    key={`${instance.id}-${m}-line`}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    draggable
                  />
                )
              )
            )}
          </Layer>
        ))}
        {/* Temp Layer: Shapes are drawn here then when finished they are sent back to the selected mask */}
        <Layer name="Temp Layer">
          {annotationsToDraw.map((options, m) => {
            return (
              <Rect
                {...options}
                stroke="black"
                key={'temp-rect' + m}
                opacity={0.7}
                draggable
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
};

export default React.memo(Workspace);
