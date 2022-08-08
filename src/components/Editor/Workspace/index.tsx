import { useRef, useState } from 'react';
import { Stage, Layer, Rect, Line, Group, Text } from 'react-konva';
import useDraw from '../hooks/useDraw';
import BackgroundImage from './BackgroundImage';
import useZoom from 'src/components/Editor/hooks/useZoom';
import Konva from 'konva';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { TOOLS } from 'src/constants';
import Rectangle from '../Rectangle';
import { updateShape } from 'src/redux/slices/editor/editor.actions';
import { Layer as LayerType } from 'src/constants/layers';
import useStageDrag from '../hooks/useStageDrag';

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
  // const tooltipRef = useRef<Konva.Text>(null);

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
    lines,
    newTooltip,
    handleMouseEnter,
    handleMouseLeave,
    showTooltip,
    hideTooltip,
    // hideTooltipeDrag,
    hideShapeTemporarily,
    // eraserLines,
  } = useDraw(
    selectedLayerId,
    layers[selectedLayerId]?.color,
    workspaceRef,
    stageRef,
    currentTool
  );

  const { handleKeyDown, handleKeyUp, stageDragging } =
    useStageDrag(workspaceRef);

  const { stageScale, handleWheel } = useZoom();

  // For Rectangle transformation (size & rotation)
  const handleRectChange = (newAttrs: Konva.ShapeConfig) => {
    if (newAttrs?.id && newAttrs?.id?.length > 0) {
      dispatch(updateShape(selectedLayerId, newAttrs));
    }
  };

  return (
    <div
      ref={workspaceRef}
      style={{ backgroundColor: '#C6C6C6' }}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      tabIndex={0}
    >
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
          // check Deselect(e);
          if (stageDragging) return;
          handleMouseDown(e);
        }}
        onClick={(e) => {
          checkDeselect(e);
          // hideTooltip();
          // e.cancelBubble = true;
        }}
        draggable={stageDragging}
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

        <Layer width={WIDTH} height={HEIGHT}>
          {layers.map((layer: LayerType, i) =>
            layer.instances.map((instance) =>
              instance.shapes?.map((group, m) => (
                <Group
                  key={`group-${m}-${i}`}
                  x={0}
                  y={0}
                  draggable={currentTool === TOOLS.SELECT && !stageDragging}
                  name={layer.title}
                  visible={layer.visible}
                  // onClick={showTooltip}
                  onDragStart={hideTooltip}
                >
                  {group.map((shape, l) =>
                    shape.type === TOOLS.LINE ? (
                      <Line
                        {...shape}
                        key={`line-${m}-${l}`}
                        listening={shape.type === TOOLS.LINE}
                        draggable={shape.type === TOOLS.LINE}
                        layer={layer.title}
                        onClick={showTooltip}
                      />
                    ) : (
                      <Rectangle
                        key={`${instance.id}-${m}-${l}-rect`}
                        shapeProps={shape}
                        layer={layer.title}
                        isSelected={shape.id === selectedId}
                        onClick={(e: any) => {
                          if (shape.id) {
                            selectShape(shape.id);
                          }
                          showTooltip(e);
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
            )
          )}
          {/* Temporary shapes */}
          {/* {eraserLines.map((options, e) => (
            <Line
              {...options}
              key={'temp-eraser-line' + e}
              listening={false}
              draggable={false}
            />
          ))} */}
          {lines.map((options, l) => (
            <Line
              {...options}
              key={'temp-line' + l}
              listening={false}
              draggable={false}
            />
          ))}
          {newTooltip.text.length > 0 && (
            <>
              <Rect
                x={newTooltip.x - 8}
                y={newTooltip.y - 5}
                width={newTooltip.rectWidth}
                height={24}
                stroke={'rgba(0,0,0,0.4)'}
                strokeWidth={2}
                fill={'rgba(103,58,183, 0.8)'}
                shadowColor="rgba(0,0,0,.3)"
                shadowBlur={2}
                shadowOffsetX={10}
                shadowOffsetY={0}
                shadowOpacity={0.2}
                cornerRadius={5}
              />
              <Text {...newTooltip} />
            </>
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default Workspace;
