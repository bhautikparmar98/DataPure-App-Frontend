import Konva from 'konva';
import { useCallback, useRef } from 'react';
import { Group, Image, Layer, Rect, Stage, Text } from 'react-konva';
import { useDispatch, useSelector } from 'react-redux';
import useZoom from 'src/components/Editor/hooks/useZoom';
import { Class, TOOLS } from 'src/constants';
import { updateShape } from 'src/redux/slices/classes/classes.slice';
import { RootState } from 'src/redux/store';
import useImage from 'use-image';
import useBackground from '../hooks/useBackground';
import useCursor from '../hooks/useCursor';
import useDraw from '../hooks/useDraw';
import useKeyboard from '../hooks/useKeyboard';
import useSelectShape from '../hooks/useSelectShape';
import useShapesCache from '../hooks/useShapesCache';
import useTooltip from '../hooks/useTooltip';
import BackgroundImage from './BackgroundImage';
import Shapes from './Shapes';
import TempShapes from './TempShapes';

interface Layer {
  classes: Class[];
  selectedClassIndex: number;
  comments: { text: string; x: number; y: number }[];
}

interface IProps {
  TOOLBAR_WIDTH: number;
  LAYERS_PANEL_WIDTH: number;
  WIDTH: number;
  HEIGHT: number;
  onAddComment: (text: string, x: number, y: number) => void;
  onDeleteComment: (commentId: string) => void;
}

const Workspace: any = ({
  TOOLBAR_WIDTH,
  LAYERS_PANEL_WIDTH,
  WIDTH,
  HEIGHT,
  onAddComment,
  onDeleteComment,
}: IProps) => {
  const dispatch = useDispatch();

  const currentTool = useSelector(({ editor }: RootState) => editor.tool);

  const {
    classes = [],
    selectedClassIndex = 0,
    src,
  } = useSelector(({ classes }: RootState) => classes);

  const classId: string = classes[selectedClassIndex]?._id;

  const workspaceRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const shapesRef = useRef<Konva.Group>(null);
  const shapesLayerRef = useRef<Konva.Layer>(null);
  const bgLayerRef = useRef<Konva.Layer>(null);

  const {
    background,
    backgroundStatus,
    width,
    height,
    bgX,
    bgY,
    bgWidthScale,
    bgHeightScale,
  } = useBackground({
    url: src,
    stageWidth: WIDTH,
    stageHeight: HEIGHT,
  });

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
    rectHandleMouseDown,
    rectHandleMouseUp,
    rectHandleMouseMove,
    lineHandleMouseDown,
    lineHandleMouseUp,
    lineHandleMouseMove,
  } = useDraw(
    selectedClassIndex,
    classId,
    classes[selectedClassIndex]?.color,
    stageRef,
    bgLayerRef,
    currentTool,
    stageDragging,
    width,
    bgWidthScale,
    bgHeightScale,
    onAddComment,
    onDeleteComment,
    selectedId
  );
  const { setCursorStyle } = useCursor(workspaceRef);

  const { tooltip, showTooltip, hideTooltip } = useTooltip(stageRef);

  const { stageScale, handleWheel, zooming } = useZoom();

  const { cachedVisible } = useShapesCache({
    stageRef,
    zooming,
    stageDragging,
    classes,
  });

  const [image] = useImage(`/tools/${TOOLS.COMMENT}.png`);

  // For Rectangle transformation (size & rotation)
  const handleRectChange = useCallback((newAttrs: Konva.ShapeConfig) => {
    if (newAttrs?.id && newAttrs?.id?.length > 0) {
      dispatch(updateShape({ selectedClassIndex, newAttrs }));
    }
  }, []);

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
      {backgroundStatus === 'loaded' && classes.length > 0 ? (
        <Stage
          width={WIDTH}
          height={HEIGHT}
          ref={stageRef}
          onWheel={handleWheel}
          scaleX={stageScale.stageScale}
          scaleY={stageScale.stageScale}
          x={stageScale.stageX}
          y={stageScale.stageY}
          onMouseMove={
            currentTool === TOOLS.RECTANGLE
              ? rectHandleMouseMove
              : currentTool === TOOLS.LINE
              ? lineHandleMouseMove
              : () => {}
          }
          onMouseUp={
            currentTool === TOOLS.RECTANGLE
              ? rectHandleMouseUp
              : lineHandleMouseUp
          }
          onMouseDown={
            currentTool === TOOLS.RECTANGLE
              ? rectHandleMouseDown
              : lineHandleMouseDown
          }
          // onMouseUp={handleMouseUp}
          // onMouseDown={(e: any) => {
          //   checkDeselect(e);
          //   if (stageDragging) return;
          //   handleMouseDown(e);
          // }}
          onClick={(e) => {
            checkDeselect(e);
            hideTooltip();
            // e.cancelBubble = true;
          }}
          draggable={stageDragging}
          onDragEnd={() => {}}
        >
          <Layer ref={bgLayerRef} id="background_layer" listening={false}>
            <BackgroundImage
              width={width}
              height={height}
              background={background}
              x={bgX}
              y={bgY}
            />
          </Layer>
          {!cachedVisible && (
            <Layer id="shapes_layer" ref={shapesLayerRef}>
              <Group ref={shapesRef} id="shapes_group">
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
                  zooming={false}
                  bgX={bgX}
                  bgY={bgY}
                  bgWidthScale={bgWidthScale}
                  bgHeightScale={bgHeightScale}
                />
              </Group>
            </Layer>
          )}

          <Layer>
            <TempShapes
              lines={lines}
              rects={rects}
              classColor={classes[selectedClassIndex]?.color}
            />
            {tooltip.text.length > 0 && (
              <Group y={10}>
                <Rect
                  listening={false}
                  x={tooltip.x}
                  y={tooltip.y}
                  offsetX={5}
                  scaleX={1 / stageScale.stageScale}
                  scaleY={1 / stageScale.stageScale}
                  width={tooltip.rectWidth}
                  height={18}
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
                <Text
                  {...tooltip}
                  scaleX={2 / stageScale.stageScale}
                  scaleY={2 / stageScale.stageScale}
                />
              </Group>
            )}

            {currentTool === TOOLS.COMMENT &&
              comments.map((comment, commendIndex) => (
                <Image
                  key={commendIndex}
                  width={60 / stageScale.stageScale}
                  height={60 / stageScale.stageScale}
                  image={image}
                  x={comment.x}
                  y={comment.y}
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
      ) : (
        <div
          style={{
            height: HEIGHT - 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <p
            style={{
              marginLeft: -(TOOLBAR_WIDTH + LAYERS_PANEL_WIDTH) / 2,
              fontSize: '1.3rem',
            }}
          >
            Annotations are loading...
          </p>
        </div>
      )}
    </div>
  );
};

export default Workspace;
