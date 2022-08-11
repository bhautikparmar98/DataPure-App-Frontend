import { useRef, useState } from 'react';
import { Stage, Layer, Rect, Line, Group, Text, Image } from 'react-konva';
import useDraw from '../hooks/useDraw';
import BackgroundImage from './BackgroundImage';
import useZoom from 'src/components/Editor/hooks/useZoom';
import Konva from 'konva';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { TOOLS } from 'src/constants';
import Rectangle from '../Rectangle';
import { updateShape } from 'src/redux/slices/layers/layers.actions';
import { Layer as LayerType } from 'src/constants/layers';
import useTooltip from '../hooks/useTooltip';
import useKeyboard from '../hooks/useKeyboard';
import useImage from 'use-image';
import useCursor from '../hooks/useCursor';

const TOOLBAR_WIDTH = 70;
const LAYERS_PANEL_WIDTH = 300;
const WIDTH = window.innerWidth - (TOOLBAR_WIDTH + LAYERS_PANEL_WIDTH);
const HEIGHT = window.innerHeight;

interface Layers {
  layers: LayerType[];
  selectedLayerId: number;
  comments: { text: string; x: number; y: number }[];
}

const Workspace: any = () => {
  const currentTool = useAppSelector(({ editor }) => editor.tool);
  const { layers = [], selectedLayerId = 0 } = useAppSelector<Layers>(
    ({ layers }) => layers
  );

  const dispatch = useAppDispatch();

  const workspaceRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);

  const [selectedId, selectShape] = useState('');

  const { handleKeyDown, handleKeyUp, stageDragging } = useKeyboard(
    workspaceRef,
    stageRef,
    selectedId
  );

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
    hideShapeTemporarily,
    comments,
    handleCommentClick,
    handleShapeMove,
    // eraserLines,
  } = useDraw(
    selectedLayerId,
    layers[selectedLayerId]?.color,
    workspaceRef,
    stageRef,
    currentTool
  );
  const { setCursorStyle } = useCursor(workspaceRef);

  const { tooltip, showTooltip, hideTooltip } = useTooltip(stageRef);

  const { stageScale, handleWheel } = useZoom();

  const [image] = useImage(`/tools/${TOOLS.COMMENT}.svg`);

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
      onKeyDown={(e) => {
        hideTooltip();
        handleKeyDown(e);
      }}
      tabIndex={0}
      onKeyUp={handleKeyUp}
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
        // onDragEnd={() => {}}
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

        <Layer>
          {layers.map((layer: LayerType, i) =>
            layer.instances.map((instance) =>
              instance.shapes?.map((shape, m) => (
                <Group
                  key={`group-${m}-${i}`}
                  x={0}
                  y={0}
                  draggable={currentTool === TOOLS.SELECT && !stageDragging}
                  name={layer.title}
                  visible={instance.visible}
                  onDragStart={hideTooltip}
                  tabIndex={1}
                  layerId={i}
                  instanceId={instance.id}
                  onDragEnd={(e) => handleShapeMove(e, i, shape, instance.id)}
                >
                  {shape.map((shape, l) =>
                    shape.type === TOOLS.LINE ? (
                      <Line
                        {...shape}
                        key={`line-${m}-${l}`}
                        listening={shape.type === TOOLS.LINE}
                        draggable={shape.type === TOOLS.LINE}
                        layer={layer.title}
                        isSelected={shape.id === selectedId}
                        onClick={(e: any) => {
                          if (shape.id) {
                            selectShape(shape.id);
                          }
                          showTooltip(e);
                        }}
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
          {tooltip.text.length > 0 && (
            <Group draggable>
              <Rect
                x={tooltip.x - 8}
                y={tooltip.y - 5}
                width={tooltip.rectWidth}
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
              <Text {...tooltip} />
            </Group>
          )}
          {currentTool === TOOLS.COMMENT &&
            comments.map((comment, commendIndex) => (
              <Image
                x={comment.x}
                y={comment.y}
                key={`comment-${commendIndex}`}
                image={image}
                alt="Comment"
                type="Comment"
                draggable
                onClick={(e) =>
                  handleCommentClick(e, comment.text, commendIndex)
                }
                onMouseEnter={(_) => setCursorStyle('pointer')}
                onMouseLeave={(_) => setCursorStyle()}
              />
            ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default Workspace;
