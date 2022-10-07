import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import _ from 'lodash';
import next from 'next';
import { memo } from 'react';
import { Group, Line } from 'react-konva';
import { Class, Tool, TOOLS } from 'src/constants';
import Rectangle from './Rectangle';

interface IShapes {
  classes: Class[];
  currentTool: Tool;
  selectedId: string;
  stageDragging: boolean;
  handleRectChange: (newAttrs: Konva.ShapeConfig) => void;
  selectShape: (shapeId: string) => void;
  hideShapeTemporarily: (e: KonvaEventObject<MouseEvent>) => void;
  zooming: boolean;
  bgX: number;
  bgY: number;
  bgWidthScale: number;
  bgHeightScale: number;
  handleShapeMove: (
    e: any,
    classId: number,
    group: any,
    annotationId: string
  ) => void;
  showTooltip: (e: Konva.KonvaEventObject<DragEvent>) => void;
  hideTooltip: () => void;
}

const Shapes = ({
  classes,
  handleRectChange,
  showTooltip,
  selectShape,
  hideShapeTemporarily,
  handleShapeMove,
  currentTool,
  selectedId,
  stageDragging,
  hideTooltip,
  zooming,
  bgX,
  bgY,
  bgWidthScale,
  bgHeightScale,
}: IShapes) => (
  <>
    {classes.map((classItem: Class, i) =>
      classItem.annotations.map((annotation) =>
        annotation.shapes?.map(
          (shape, m) =>
            annotation.visible && (
              <Group
                key={shape.id}
                x={0}
                y={0}
                draggable={currentTool === TOOLS.SELECT && !stageDragging}
                name={classItem.name}
                onDragStart={hideTooltip}
                tabIndex={1}
                classId={i}
                annotationId={annotation.id}
                onDragEnd={(e) => handleShapeMove(e, i, shape, annotation.id!)}
              >
                {shape.type === TOOLS.LINE ? (
                  <Line
                    {...shape}
                    key={shape.id + '-line'}
                    draggable
                    class={classItem.name}
                    isSelected={shape.id === selectedId}
                    onClick={(e: any) => {
                      if (shape.id) {
                        selectShape(shape.id);
                      }
                      showTooltip(e);
                      e.cancelBubble = true; // to not trigger parents click
                    }}
                    opacity={1}
                    stroke={classItem.color}
                    strokeWidth={10}
                    tension={0.5}
                    lineCap="round"
                  />
                ) : (
                  <Rectangle
                    key={shape.id + '-rect'}
                    shapeProps={{
                      ...shape,
                      fill: classItem.color
                        .replace(')', ', 0.6)')
                        .replace('rgb', 'rgba'),
                      stroke: classItem.color,
                      width: shape.width * bgWidthScale,
                      height: shape.height * bgHeightScale,
                    }}
                    classItemName={classItem.name}
                    isSelected={shape.id === selectedId}
                    onClick={(e: any) => {
                      if (shape.id) {
                        selectShape(shape.id);
                      }
                      showTooltip(e);
                      e.cancelBubble = true; // to not trigger parents click
                    }}
                    onChange={handleRectChange}
                    onDblClick={hideShapeTemporarily}
                    hideTransformer={stageDragging || zooming}
                    bgX={bgX}
                    bgY={bgY}
                    bgWidthScale={bgWidthScale}
                    bgHeightScale={bgHeightScale}
                  />
                )}
              </Group>
            )
        )
      )
    )}
  </>
);

export default Shapes;
