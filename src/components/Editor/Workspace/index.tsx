import { useSelect } from '@mui/base';
import Konva from 'konva';
import { useMemo, useRef, useState } from 'react';
import { Group, Image, Layer, Rect, Stage, Text } from 'react-konva';
import { useSelector } from 'react-redux';
import { Root } from 'rehype-raw';
import useZoom from 'src/components/Editor/hooks/useZoom';
import { Class, TOOLS } from 'src/constants';
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
  comments: { value: string; x: number; y: number }[];
}

interface IProps {
  TOOLBAR_WIDTH: number;
  LAYERS_PANEL_WIDTH: number;
  WIDTH: number;
  HEIGHT: number;
  onAddComment: (text: string, x: number, y: number) => void;
  onDeleteComment: (commentId: string) => void;
  setAnnotationId: (a: string) => void;
  fetchingNewImages: boolean;
}

const Workspace: any = ({
  TOOLBAR_WIDTH,
  LAYERS_PANEL_WIDTH,
  WIDTH,
  HEIGHT,
  fetchingNewImages,
  onAddComment,
  onDeleteComment,
  setAnnotationId,
}: IProps) => {
  const currentTool = useSelector((state: RootState) => state.editor.tool);
  const stageDragging = useSelector((state: RootState) => state.editor.stageDragging);
  const classes = useSelector((state: RootState) => state.classes.classes);
  const src = useSelector((state: RootState) => state.classes.src);
  const selectedClassIndex = useSelector((state: RootState) => state.classes.selectedClassIndex);
  const multiselectedAnnotators = useSelector((state: RootState) => state.classes.multiselectedAnnotators)
  const [preAnnotation, setPreAnnotation] = useState<any>();

  const classId: string = classes[selectedClassIndex]?._id;

  const workspaceRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const shapesRef = useRef<Konva.Group>(null);
  const shapesLayerRef = useRef<Konva.Layer>(null);
  const bgLayerRef = useRef<Konva.Layer>(null);

  const { background, backgroundStatus, width, height, bgX, bgY, bgWidthScale, bgHeightScale } = useBackground({
    url: src,
    stageWidth: WIDTH,
    stageHeight: HEIGHT,
  });

  const { selectShape, selectedId, checkDeselect } = useSelectShape();


  const { handleKeyDown, handleKeyUp } = useKeyboard(workspaceRef, stageRef, selectedId);

  const {
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleComment,
    Area,
    rects,
    lines,
    handleShapeMove,
    comments,
    handleCommentClick,
    rectHandleMouseDown,
    rectHandleMouseUp,
    rectHandleMouseMove,
    lineHandleMouseDown,
    lineHandleMouseUp,
    lineHandleMouseMove,
    handleMultipleSelectMouseDown,
    handleMultipleSelectMouseUp,
    handleMultipleSelectMouseMove
  } = useDraw(
    selectedClassIndex,
    classId,
    classes[selectedClassIndex]?.color,
    stageRef,
    bgLayerRef,
    currentTool,
    width,
    bgWidthScale,
    bgHeightScale,
    onAddComment,
    onDeleteComment
  );
  const { setCursorStyle } = useCursor(workspaceRef);

  const { tooltip, showTooltip, hideTooltip } = useTooltip(stageRef);

  const { stageScale, handleWheel, zooming } = useZoom();

  const { cachedVisible } = useShapesCache({
    stageRef,
    zooming,
  });
  
  const [image] = useImage(`/tools/${TOOLS.COMMENT}.png`);

  let commentFactor = Math.min(stageScale.stageScale / 10, 2);
  if (stageScale.stageScale >= 1) {
    commentFactor = Math.min(1 / stageScale.stageScale, 1 / 20);
  }

  return (
    <div
      ref={workspaceRef}
      style={{ backgroundColor: '#C6C6C6' }}
      onKeyDown={(e) => {
        hideTooltip();
        handleKeyDown(e);
      }}
      tabIndex={0}
      onKeyUp={handleKeyUp}>
      {!fetchingNewImages && backgroundStatus === 'loaded' && classes.length > 0 ? (
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
              : currentTool === TOOLS.MULTIPLESELECT
              ? handleMultipleSelectMouseMove
              : () => {}
          }
          onMouseUp={currentTool === TOOLS.MULTIPLESELECT ? handleMultipleSelectMouseUp : currentTool === TOOLS.RECTANGLE ? rectHandleMouseUp : lineHandleMouseUp}
          onMouseDown={(e: any) => {
            setAnnotationId(e.target?.attrs ? e.target.attrs.id : '');
            currentTool === TOOLS.RECTANGLE
              ? rectHandleMouseDown(e)
              : currentTool === TOOLS.LINE
              ? lineHandleMouseDown(e)
              : currentTool === TOOLS.COMMENT
              ? handleComment(e)
              : currentTool === TOOLS.MULTIPLESELECT
              ? handleMultipleSelectMouseDown(e)
              : () => {}
          }}
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
          onDragEnd={() => {}}>
          <Layer ref={bgLayerRef} id="background_layer" listening={false}>
            <BackgroundImage width={width} height={height} background={background} x={bgX} y={bgY} />
          </Layer>
          <Layer id="shapes_layer" ref={shapesLayerRef} listening={!cachedVisible}>
            <Group ref={shapesRef} id="shapes_group">
              <Shapes
                classes={classes}
                showTooltip={showTooltip}
                selectShape={selectShape}
                handleShapeMove={handleShapeMove}
                currentTool={currentTool}
                selectedId={selectedId}
                hideTooltip={hideTooltip}
                zooming={false}
                bgX={bgX}
                bgY={bgY}
                bgWidthScale={bgWidthScale}
                bgHeightScale={bgHeightScale}
                stageScale={stageScale.stageScale}
              />
            </Group>
          </Layer>

          <Layer>
            <TempShapes
              lines={lines}
              rects={rects}
              Area={Area}
              classColor={classes[selectedClassIndex]?.color}
              stageScale={stageScale.stageScale}
            />
            {tooltip.text.length > 0 && (
              <Group>
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
                <Text {...tooltip} scaleX={2 / stageScale.stageScale} scaleY={2 / stageScale.stageScale} />
              </Group>
            )}

            {currentTool === TOOLS.COMMENT &&
              comments.map((comment, commendIndex) => (
                <Image
                  key={commendIndex}
                  width={1500}
                  height={1500}
                  image={image}
                  scaleX={commentFactor * 0.5}
                  scaleY={commentFactor * 0.5}
                  x={comment.x * bgWidthScale + bgX + (-1500 / 2) * commentFactor}
                  y={comment.y * bgHeightScale + bgY + (-1500 / 2) * commentFactor}
                  alt="Comment"
                  type="Comment"
                  draggable
                  onClick={(e) => handleCommentClick(e, comment.text, commendIndex)}
                  onMouseEnter={(_) => setCursorStyle('pointer')}
                  onMouseLeave={(_) => setCursorStyle()}
                />
              ))}
          </Layer>
        </Stage>
      ) : (
        <div
          style={{
            height: HEIGHT,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <p
            style={{
              marginLeft: -(TOOLBAR_WIDTH + LAYERS_PANEL_WIDTH) / 2,
              fontSize: '1.3rem',
            }}>
            Annotations are loading...
          </p>
        </div>
      )}
    </div>
  );
};

export default Workspace;
