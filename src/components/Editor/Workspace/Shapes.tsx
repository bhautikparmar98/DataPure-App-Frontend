import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
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
}: IShapes) => (
  <>
    {classes.map((classItem: Class, i) =>
      classItem.annotations.map((annotation) =>
        annotation.shapes?.map(
          (shape, m) =>
            annotation.visible && (
              <Group
                key={`group-${m}-${shape.id}`}
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
                    key={`line-${m}-${i}`}
                    listening={shape.type === TOOLS.LINE}
                    draggable={shape.type === TOOLS.LINE}
                    class={classItem.name}
                    isSelected={shape.id === selectedId}
                    onClick={(e: any) => {
                      if (shape.id) {
                        selectShape(shape.id);
                      }
                      showTooltip(e);
                    }}
                    opacity={1}
                    stroke={classItem.color}
                    strokeWidth={10}
                    tension={0.5}
                    lineCap="round"
                  />
                ) : (
                  <Rectangle
                    key={`rect-${m}-${i}`}
                    shapeProps={{
                      ...shape,
                      fill: classItem.color
                        .replace(')', ', 0.6)')
                        .replace('rgb', 'rgba'),
                      stroke: classItem.color,
                    }}
                    classItemName={classItem.name}
                    isSelected={shape.id === selectedId}
                    onClick={(e: any) => {
                      if (shape.id) {
                        selectShape(shape.id);
                      }
                      showTooltip(e);
                    }}
                    onChange={handleRectChange}
                    onDblClick={hideShapeTemporarily}
                    hideTransformer={stageDragging || zooming}
                    bgX={bgX}
                    bgY={bgY}
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
