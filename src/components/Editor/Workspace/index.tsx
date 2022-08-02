import React, { useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Line, Group } from 'react-konva';
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

const Workspace: any = () => {
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
    eraserLines,
    handleMouseEnter,
    handleMouseLeave,
  } = useDraw(
    selectedLayerId,
    layers[selectedLayerId].color,
    workspaceRef,
    currentTool
  );

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
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <Layer name="Background Layer">
          <BackgroundImage width={WIDTH} height={HEIGHT} url="/images/1.png" />
        </Layer>

        <Layer name="Temp Layer">
          {/* <Group> */}
          {newRects.map((options, m) => (
            <Rect {...options} key={'temp-rect' + m} />
          ))}
        </Layer>

        {layers.map((layer, i) => (
          <Layer name={layer.title} key={`layer-${i}`} visible={layer.visible}>
            {layer.instances.map((instance) =>
              instance.shapes?.map((group, m) => (
                <Group
                  key={`group-${m}-${i}`}
                  x={0}
                  y={0}
                  draggable={currentTool === TOOLS.SELECT}
                >
                  {group.map((shape, l) =>
                    shape.type === TOOLS.ERASER ? (
                      <Line
                        {...shape}
                        key={`line-${m}-${l}`}
                        // listening={false}
                        listening={false}
                        strokeWidth={25}
                        tension={0.5}
                        lineCap={'round'}
                        lineJoin={'round'}
                        draggable={false}
                      />
                    ) : (
                      <Rect
                        {...shape}
                        key={`${instance.id}-${m}-rect`}
                        // onDragStart={handleDragStart}
                        // onDragEnd={handleDragEnd}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        draggable={false}
                      />
                    )
                  )}
                </Group>
              ))
            )}
            {/* Temporary lines */}
            {eraserLines.map((options, m) => (
              <Line
                {...options}
                key={'temp-rect' + m}
                listening={false}
                strokeWidth={25}
                tension={0.5}
                lineCap={'round'}
                lineJoin={'round'}
                draggable={false}
              />
            ))}
          </Layer>
        ))}
      </Stage>
    </div>
  );
};

export default React.memo(Workspace);
