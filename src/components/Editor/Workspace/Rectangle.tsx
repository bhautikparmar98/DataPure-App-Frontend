import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import isEqual from 'lodash/isEqual';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { Rect, Transformer } from 'react-konva';
import { useDispatch } from 'react-redux';
import { updateShape } from 'src/redux/slices/classes/classes.slice';
interface IRectangle {
  shapeProps: Konva.ShapeConfig;
  isSelected: boolean;
  hideTransformer: boolean;
  bgX: number;
  bgY: number;
  classItemName: string;
  onClick: (e: KonvaEventObject<Event>) => void;
  onDblClick: (e: KonvaEventObject<MouseEvent>) => void;
  otherProps?: any;
  bgWidthScale: number;
  bgHeightScale: number;
}

const Rectangle = ({
  shapeProps,
  isSelected,
  hideTransformer,
  onClick,
  onDblClick,
  classItemName,
  bgX,
  bgY,
  bgWidthScale,
  bgHeightScale,
  ...otherProps
}: IRectangle) => {
  const shapeRef = useRef<Konva.Rect>(null);
  const trRef = useRef<Konva.Transformer>(null);

  const props = useMemo(() => shapeProps, []);

  const dispatch = useDispatch();
  // For Rectangle transformation (size & rotation)
  const handleRectChange = useCallback((newAttrs: Konva.ShapeConfig) => {
    if (newAttrs?.id && newAttrs?.id?.length > 0) {
      dispatch(
        updateShape({
          classItemName,
          newAttrs: {
            x: newAttrs?.x || 0,
            y: newAttrs?.y || 0,
            width: newAttrs?.width || 0,
            height: newAttrs?.height || 0,
            id: newAttrs?.id || '',
            points: newAttrs?.points || [],
          },
        })
      );
    }
  }, []);

  const handleTransformEnd = useCallback((e: KonvaEventObject<Event>) => {
    // transformer is changing scale of the node
    // and NOT its width or height
    // but in the store we have only width and height
    // to match the data better we will reset scale on transform end
    const node = shapeRef.current;

    if (node) {
      const scaleX = node.scaleX();
      const scaleY = node.scaleY()!;

      // we will reset it back
      node.scaleX(1);
      node.scaleY(1);
      handleRectChange({
        ...props,
        // reset x,y pair to be without the (coords * scale) of the background in redux state
        x: (node.x() - bgX) / bgWidthScale,
        y: (node.y() - bgY) / bgHeightScale,
        // set minimal value
        width: Math.max(5, (node.width() * scaleX) / bgWidthScale),
        height: Math.max(5, (node.height() * scaleY) / bgHeightScale),
      });
    }
  }, []);

  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      if (trRef?.current?.nodes && trRef?.current?.getLayer && shapeRef.current) {
        trRef.current.nodes([shapeRef.current]);
        trRef.current.getLayer()?.batchDraw();
      }
    }
  }, [isSelected]);

  return (
    <>
      <Rect
        onClick={onClick}
        ref={shapeRef}
        {...props}
        x={(props.x || 0) * bgWidthScale + bgX}
        y={(props.y || 0) * bgHeightScale + bgY}
        class={classItemName}
        onDblClick={onDblClick}
        onDragEnd={(e: any) => {
          handleRectChange({
            ...props,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={handleTransformEnd}
        {...otherProps}
        draggable={false}
      />
      {isSelected && !hideTransformer && (
        <Transformer
          ref={trRef}
          rotateEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

// this needs some optimization
const propsAreEqual = (prev: IRectangle, next: IRectangle) => {
  return prev.isSelected === next.isSelected && isEqual(prev.shapeProps, next.shapeProps);
};

export default memo(Rectangle, propsAreEqual);
