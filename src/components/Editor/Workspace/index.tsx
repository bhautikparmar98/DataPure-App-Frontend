import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Line, Circle } from 'react-konva';
import useDraw from '../hooks/useDraw';
import BackgroundImage from './BackgroundImage';
import useZoom from 'src/components/Editor/hooks/useZoom';
import Konva from 'konva';
import { useAppSelector } from 'src/redux/store';
import { TOOLS } from 'src/constants';

const TOOLBAR_WIDTH = 70;
const LAYERS_PANEL_HEIGHT = 60;
const WIDTH = window.innerWidth - TOOLBAR_WIDTH;
const HEIGHT = window.innerHeight - LAYERS_PANEL_HEIGHT;

const Workspace = () => {
  const [layers, selectedLayerId, currentTool] = useAppSelector(
    ({ editor }) => [editor.layers, editor.selectedLayerId, editor.tool]
  );

  const workspaceRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const {
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    rects: newRects,
    erasedParts,
    handleDragStart,
    handleDragEnd,
    handleMouseEnter,
    handleMouseLeave,
  } = useDraw(
    selectedLayerId,
    layers[selectedLayerId].color,
    workspaceRef,
    currentTool
  );

  // const [rects, setRects] = useState<Konva.ShapeConfig[]>([]);
  const { stageScale, handleWheel } = useZoom();

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
        {layers.map((layer, i) => (
          <Layer
            name={layer.title}
            key={`layer-${layer.title}-${i}`}
            visible={layer.visible}
          >
            {layer.instances.map((instance) =>
              instance.shapes?.map((shape, m) =>
                shape.type === TOOLS.ERASER ? (
                  <Circle
                    {...shape}
                    key={'temp-rect' + m}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    listening={false}
                  />
                ) : (
                  <Rect
                    {...shape}
                    key={`${instance.id}-${m}-rect`}
                    // onDragStart={handleDragStart}
                    // onDragEnd={handleDragEnd}
                    // onMouseEnter={handleMouseEnter}
                    // onMouseLeave={handleMouseLeave}
                    // draggable
                  />
                )
              )
            )}
          </Layer>
        ))}

        {/* Temp Layer: Shapes are drawn here then when finished they are sent back to the selected layer */}
        <Layer name="Temp Layer">
          {newRects.map((options, m) => (
            <Rect
              {...options}
              key={'temp-rect' + m}
              // draggable
              // onDragStart={handleDragStart}
              // onDragEnd={handleDragEnd}
              // onMouseEnter={handleMouseEnter}
              // onMouseLeave={handleMouseLeave}
            />
          ))}
        </Layer>
        <Layer>
          {erasedParts.map((options, m) => (
            <Circle
              {...options}
              key={'temp-rect' + m}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              listening={false}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default React.memo(Workspace);
