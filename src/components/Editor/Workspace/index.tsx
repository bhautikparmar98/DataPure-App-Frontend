import Konva from 'konva';
import { useEffect, useRef } from 'react';
import { Group, Image, Layer, Rect, Stage, Text } from 'react-konva';
import useZoom from 'src/components/Editor/hooks/useZoom';
import { TOOLS } from 'src/constants';
import { Class } from 'src/constants/classes';
import { updateShape } from 'src/redux/slices/classes/classes.actions';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import useImage from 'use-image';
import useCursor from '../hooks/useCursor';
import useDraw from '../hooks/useDraw';
import useKeyboard from '../hooks/useKeyboard';
import useSelectShape from '../hooks/useSelectShape';
import useTooltip from '../hooks/useTooltip';
import BackgroundImage from './BackgroundImage';
import Shapes from './Shapes';
import TempShapes from './TempShapes';

const TOOLBAR_WIDTH = 70;
const LAYERS_PANEL_WIDTH = 300;
const WIDTH = window.innerWidth - (TOOLBAR_WIDTH + LAYERS_PANEL_WIDTH);
const HEIGHT = window.innerHeight;

interface Layer {
  classes: Class[];
  selectedClassId: number;
  comments: { text: string; x: number; y: number }[];
}

const Workspace: any = () => {
  const dispatch = useAppDispatch();

  const [currentTool] = useAppSelector(({ editor }) => [editor.tool]);

  const {
    classes = [],
    selectedClassId = 0,
    src,
  } = useAppSelector(({ classes }) => classes);

  const workspaceRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const shapesRef = useRef<Konva.Group>(null);

  const { selectShape, selectedId, checkDeselect } = useSelectShape();

  const { handleKeyDown, handleKeyUp, stageDragging } = useKeyboard(
    workspaceRef,
    stageRef,
    selectedId
  );

  const {
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    rects,
    lines,
    hideShapeTemporarily,
    handleShapeMove,
    comments,
    handleCommentClick,
  } = useDraw(
    selectedClassId,
    classes[selectedClassId]?.color,
    stageRef,
    currentTool,
    stageDragging
  );
  const { setCursorStyle } = useCursor(workspaceRef);

  const { tooltip, showTooltip, hideTooltip } = useTooltip(stageRef);

  const { stageScale, handleWheel } = useZoom();

  const [image] = useImage(`/tools/${TOOLS.COMMENT}.svg`);

  // For Rectangle transformation (size & rotation)
  const handleRectChange = (newAttrs: Konva.ShapeConfig) => {
    if (newAttrs?.id && newAttrs?.id?.length > 0) {
      dispatch(updateShape(selectedClassId, newAttrs));
    }
  };

  const handleShapesCaching = (shouldCache = true) => {
    shouldCache ? shapesRef.current?.cache() : shapesRef.current?.clearCache();
  };

  useEffect(() => {
    if (shapesRef.current) {
      stageDragging ? handleShapesCaching(true) : handleShapesCaching(false);
    }
  }, [stageDragging]);

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
          checkDeselect(e);
          if (stageDragging) return;
          handleMouseDown(e);
        }}
        onClick={(e) => {
          checkDeselect(e);
          // hideTooltip();
          // e.cancelBubble = true;
        }}
        draggable={stageDragging}
        onDragEnd={() => {}}
      >
        <Layer>
          <BackgroundImage width={WIDTH} height={HEIGHT} url={src} />
          <Group ref={shapesRef} onClick={(e) => handleShapesCaching(false)}>
            <Shapes
              classes={classes}
              handleRectChange={handleRectChange}
              showTooltip={showTooltip}
              selectShape={selectShape}
              hideShapeTemporarily={hideShapeTemporarily}
              handleShapeMove={handleShapeMove}
              currentTool={currentTool}
              selectedId={selectedId}
              stageDragging={stageDragging}
              hideTooltip={hideTooltip}
            />
          </Group>
          <TempShapes lines={lines} rects={rects} />
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
