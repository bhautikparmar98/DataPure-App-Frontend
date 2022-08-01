import React, { useRef } from 'react';
import { Stage, Layer, Rect, Line } from 'react-konva';
import useDraw from '../hooks/useDraw';
import BackgroundImage from './BackgroundImage';
import useZoom from 'src/components/Editor/hooks/useZoom';
import Konva from 'konva';
import { useAppSelector } from 'src/redux/store';

const TOOLBAR_WIDTH = 70;
const LAYERS_PANEL_HEIGHT = 60;
const WIDTH = window.innerWidth - TOOLBAR_WIDTH;
const HEIGHT = window.innerHeight - LAYERS_PANEL_HEIGHT;

const Workspace = () => {
  const [layers, selectedLayerId] = useAppSelector(({ editor }) => [
    editor.layers,
    editor.selectedLayerId,
  ]);

  const workspaceRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  console.log(layers, selectedLayerId);
  const {
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    annotationsToDraw,
    handleDragStart,
    handleDragEnd,
    handleMouseEnter,
    handleMouseLeave,
  } = useDraw(layers[selectedLayerId].color, workspaceRef);

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
            // listening={i === selectedLayerId}
          >
            {layer.instances.map((instance) =>
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
        {/* Temp Layer: Shapes are drawn here then when finished they are sent back to the selected layer */}
        <Layer name="Temp Layer">
          {annotationsToDraw.map((options, m) => (
            <Rect
              {...options}
              key={'temp-rect' + m}
              draggable
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default React.memo(Workspace);
