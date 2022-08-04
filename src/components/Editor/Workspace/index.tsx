import { useRef, useState } from 'react';
import { Stage, Layer, Rect, Line, Group } from 'react-konva';
import useDraw from '../hooks/useDraw';
import BackgroundImage from './BackgroundImage';
import useZoom from 'src/components/Editor/hooks/useZoom';
import Konva from 'konva';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { TOOLS } from 'src/constants';
import Rectangle from '../Rectangle';
import { updateShape } from 'src/redux/slices/editor/editor.actions';
import { Layer as LayerType } from 'src/constants/layers';

const TOOLBAR_WIDTH = 70;
const LAYERS_PANEL_WIDTH = 300;
const WIDTH = window.innerWidth - (TOOLBAR_WIDTH + LAYERS_PANEL_WIDTH);
const HEIGHT = window.innerHeight;

const Workspace: any = () => {
  const {
    layers,
    selectedLayerId = 0,
    tool: currentTool,
  } = useAppSelector(({ editor }) => editor);

  const workspaceRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);

  const [selectedId, selectShape] = useState('');
  const dispatch = useAppDispatch();

  const checkDeselect = (e: any) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape('');
    }
  };

  const {
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    rects: newRects,
    eraserLines,
    lines,
    handleMouseEnter,
    handleMouseLeave,
    hideShapeTemporarily,
  } = useDraw(
    selectedLayerId,
    layers[selectedLayerId]?.color,
    workspaceRef,
    stageRef,
    currentTool
  );

  const { stageScale, handleWheel } = useZoom();

  // For Rectangle transformation (size & rotation)
  const handleRectChange = (newAttrs: Konva.ShapeConfig) => {
    if (newAttrs?.id && newAttrs?.id?.length > 0) {
      dispatch(updateShape(selectedLayerId, newAttrs));
    }
  };

  return (
    <div ref={workspaceRef} style={{ backgroundColor: '#C6C6C6' }}>
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
        onMouseUp={handleMouseUp}
        onMouseDown={(e: any) => {
          checkDeselect(e);
          handleMouseDown(e);
        }}
        onTouchStart={checkDeselect}
      >
        <Layer name="Background Layer">
          <BackgroundImage width={WIDTH} height={HEIGHT} url="/images/1.jpg" />
        </Layer>

        <Layer name="Temp Layer">
          {/* <Group> */}
          {newRects.map((options, m) => (
            <Rect {...options} key={'temp-rect' + m} />
          ))}
        </Layer>

        {layers.map((layer: LayerType, i) => (
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
                    shape.type === TOOLS.ERASER || shape.type === TOOLS.LINE ? (
                      <Line
                        {...shape}
                        key={`line-${m}-${l}`}
                        listening={shape.type === TOOLS.LINE}
                        draggable={shape.type === TOOLS.LINE}
                      />
                    ) : (
                      <Rectangle
                        key={`${instance.id}-${m}-${l}-rect`}
                        shapeProps={shape}
                        isSelected={shape.id === selectedId}
                        onSelect={() => {
                          if (shape.id) {
                            selectShape(shape.id);
                          }
                        }}
                        onChange={handleRectChange}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onDblClick={hideShapeTemporarily}
                      />
                    )
                  )}
                </Group>
              ))
            )}
            {/* Temporary lines */}
            {eraserLines.map((options, e) => (
              <Line
                {...options}
                key={'temp-eraser-line' + e}
                listening={false}
                draggable={false}
              />
            ))}
            {lines.map((options, l) => (
              <Line
                {...options}
                key={'temp-line' + l}
                listening={false}
                draggable={false}
              />
            ))}
          </Layer>
        ))}
      </Stage>
    </div>
  );
};

export default Workspace;
