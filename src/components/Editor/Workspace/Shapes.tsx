import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useCallback, useEffect, useState } from 'react';
import { Group, Line } from 'react-konva';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Class, Tool, TOOLS } from 'src/constants';
import { selectInstance, selectClass, setMultiselectAnnotators, setChecks } from 'src/redux/slices/classes/classes.slice';
import { RootState } from 'src/redux/store';
import { Checks } from '../ClassesPanel';
import Rectangle from './Rectangle';

const hideShapeTemporarily = (e: KonvaEventObject<MouseEvent>) => {
  if (e?.target?.attrs?.fill) {
    let originalFill = e.target.attrs.originalFill || e.target.attrs.fill;

    e.target.attrs.fill = e.target.attrs.fill === 'rgba(0,0,0,0)' ? originalFill : 'rgba(0,0,0,0)';

    e.target.attrs.originalFill = originalFill;
  }
};

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
  stageScale: number;
  handleShapeMove: (e: any, classId: number, group: any, annotationId: string) => void;
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
  stageScale
}: IShapes) => {
  const dispatch = useDispatch();
  const handleShapeClick = useCallback(
    (
      e: any,
      shapeId: string,
      type: typeof TOOLS.RECTANGLE | typeof TOOLS.LINE,
      instanceId?: string,
      classIndex?: number,
      annoIndex?: number,
      className?: string,
      classId?: string,
      points?: any,
      height?: number,
      width?: number,
      x?: number,
      y?: number,
      color?: string,
      shape?: any
    ) => {
      selectShape(shapeId);
      dispatch(selectClass({ classIndex }))
      showTooltip(e);
      const multiselectedAnnotatorsArray = []
      multiselectedAnnotatorsArray.push({
        classId, className, height, points, id: instanceId, shapeId,
        type, width, x, y, color, visible: true, shape, classIndex
      })

      dispatch(setMultiselectAnnotators({ multiselectedAnnotatorsArray }))

      if (type === TOOLS.RECTANGLE) {
        dispatch(
          selectInstance({
            instanceId,
            classIndex,
          })
        );
      }
      if (type === TOOLS.LINE) {
        dispatch(
          selectInstance({
            instanceId,
            classIndex,
          })
        );
      }

      e.cancelBubble = true; // to not trigger parents click
    },
    []
  );

  const multiSelectChecks: Checks = {};

  const stageDragging = useSelector((state: RootState) => state.editor.stageDragging);
  const multiselectedAnnotators: any = useSelector((state: RootState) => state.classes.multiselectedAnnotators);

  const multiSelectshapeIds: any = []
  multiselectedAnnotators.forEach((anno: any) => {
    multiSelectshapeIds.push(anno.shapeId);
    multiSelectChecks[anno.id] = true;
  });


  useEffect(() => {
    const newChecks = multiSelectChecks
    dispatch(setChecks({ newChecks }))
  }, [JSON.stringify(multiSelectChecks)])


  useEffect(() => {
    if (multiselectedAnnotators.length === 0) hideTooltip()
  }, [multiselectedAnnotators.length])


  return (
    <>
      {classes.map((classItem: Class, i) =>
        classItem.annotations.map((annotation, annoIndex) =>
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
                  onDragEnd={(e) => handleShapeMove(e, i, shape, annotation.id!)}>
                  {shape.type === TOOLS.LINE ? (
                    <Line
                      {...shape}
                      key={shape.id + '-line'}
                      draggable={currentTool === TOOLS.SELECT}
                      class={classItem.name}
                      isSelected={shape.id === selectedId}
                      onClick={(e) => handleShapeClick(e, shape.id, TOOLS.LINE, annotation.id, i)}
                      opacity={0.7}
                      stroke={classItem.color}
                      strokeWidth={3}
                      tension={0.5}
                      lineCap="round"
                    />
                  ) : (
                    (!multiSelectshapeIds.includes(shape.id) && <Rectangle
                      key={shape.id + '-rect'}
                      shapeProps={{
                        ...shape,
                        fill: classItem.color.replace(')', ', 0.35)').replace('rgb', 'rgba'),
                        stroke: classItem.color,
                        width: shape.width * bgWidthScale,
                        height: shape.height * bgHeightScale,
                        strokeWidth: 3 / stageScale,
                      }}
                      classItemName={classItem.name}
                      isSelected={shape.id === selectedId || multiSelectshapeIds.includes(shape.id)}
                      onClick={(e) => handleShapeClick(e, shape.id, TOOLS.RECTANGLE, annotation.id, i,
                        annoIndex, classItem.name, classItem._id, [], shape.height, shape.width,
                        shape.x, shape.y, classItem.color, shape)}
                      onDblClick={hideShapeTemporarily}
                      hideTransformer={stageDragging || zooming}
                      bgX={bgX}
                      bgY={bgY}
                      bgWidthScale={bgWidthScale}
                      bgHeightScale={bgHeightScale}
                      stageScale={stageScale}
                      multiselectedAnnotators={multiselectedAnnotators}
                    />
                    )
                  )
                  }
                </Group>
              )
          )
        )
      )
      }
      { //for placing selected annotator at Top layer for resizing from each corner
        multiselectedAnnotators.map((anno: any, index: any) =>
        (
          anno.visible && anno.type === "Rectangle" &&
          <Group key={anno.shapeId}
            x={0}
            y={0}
            draggable={currentTool === TOOLS.SELECT && !stageDragging}
            name={anno.className}
            onDragStart={hideTooltip}
            tabIndex={1}
            classId={anno.classIndex}
            annotationId={anno.id}
            onDragEnd={(e) => handleShapeMove(e, anno.classIndex, anno.shape, anno.id!)}>
            <Rectangle
              key={anno.shapeId + '-rect'}
              shapeProps={{
                ...anno,
                fill: anno.color.replace(')', ', 0.35)').replace('rgb', 'rgba'),
                width: anno.width * bgWidthScale,
                stroke: anno.color,
                height: anno.height * bgHeightScale,
                strokeWidth: 3 / stageScale,
              }}
              classItemName={anno.className}
              isSelected={true}
              onClick={(e) => { }}
              onDblClick={hideShapeTemporarily}
              hideTransformer={stageDragging || zooming}
              bgX={bgX}
              bgY={bgY}
              bgWidthScale={bgWidthScale}
              bgHeightScale={bgHeightScale}
              stageScale={stageScale}
              multiselectedAnnotators={multiselectedAnnotators}
            />
          </Group>
        )
        )

      }
    </>
  );
};

// export default memo(Shapes);
export default Shapes;
function selectedClassIndex(arg0: { classIndex: number | undefined; }): any {
  throw new Error('Function not implemented.');
}

