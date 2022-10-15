import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import _ from 'lodash';
import next from 'next';
import { memo, useCallback, useMemo } from 'react';
import { Group, Line } from 'react-konva';
import { useSelector } from 'react-redux';
import { Class, Tool, TOOLS } from 'src/constants';
import { RootState } from 'src/redux/store';
import Rectangle from './Rectangle';

interface IShapes {
  classes: Class[];
  currentTool: Tool;
  selectedId: string;
  selectShape: (shapeId: string) => void;
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
  showTooltip,
  selectShape,
  handleShapeMove,
  currentTool,
  selectedId,
  hideTooltip,
  zooming,
  bgX,
  bgY,
  bgWidthScale,
  bgHeightScale,
}: IShapes) => {
  const handleShapeClick = useCallback((e: any, shapeId: string) => {
    selectShape(shapeId);
    showTooltip(e);
    e.cancelBubble = true; // to not trigger parents click
  }, []);

  const stageDragging = useSelector(
    (state: RootState) => state.editor.stageDragging
  );

  return (
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
                  onDragEnd={(e) =>
                    handleShapeMove(e, i, shape, annotation.id!)
                  }>
                  {shape.type === TOOLS.LINE ? (
                    <Line
                      {...shape}
                      key={shape.id + '-line'}
                      draggable={currentTool === TOOLS.SELECT}
                      class={classItem.name}
                      isSelected={shape.id === selectedId}
                      onClick={(e) => handleShapeClick(e, shape.id)}
                      opacity={0.7}
                      stroke={classItem.color}
                      strokeWidth={3}
                      tension={0.5}
                      lineCap="round"
                    />
                  ) : (
                    <Rectangle
                      key={shape.id + '-rect'}
                      shapeProps={{
                        ...shape,
                        fill: classItem.color
                          .replace(')', ', 0.35)')
                          .replace('rgb', 'rgba'),
                        stroke: classItem.color,
                        width: shape.width * bgWidthScale,
                        height: shape.height * bgHeightScale,
                        strokeWidth: 1,
                      }}
                      classItemName={classItem.name}
                      isSelected={shape.id === selectedId}
                      onClick={(e) => handleShapeClick(e, shape.id)}
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
};

// export default memo(Shapes);
export default Shapes;
