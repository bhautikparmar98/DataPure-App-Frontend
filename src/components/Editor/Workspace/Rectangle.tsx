import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useEffect, useRef } from 'react';
import { Rect, Transformer } from 'react-konva';

interface IRectangle {
  shapeProps: Konva.ShapeConfig;
  isSelected: boolean;
  hideTransformer: boolean;
  bgX: number;
  bgY: number;
  classItemName: string;
  onClick: (e: KonvaEventObject<Event>) => void;
  onChange: (e: Konva.ShapeConfig) => void;
  onDblClick: (e: KonvaEventObject<MouseEvent>) => void;
  otherProps?: any;
  bgScale: { width: number; height: number };
}

const Rectangle = ({
  shapeProps,
  isSelected,
  hideTransformer,
  onClick,
  onChange,
  onDblClick,
  classItemName,
  bgX,
  bgY,
  bgScale,
  ...otherProps
}: IRectangle) => {
  const shapeRef = useRef<Konva.Rect>(null);
  const trRef = useRef<Konva.Transformer>(null);

  const handleTransformEnd = (e: KonvaEventObject<Event>) => {
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
      onChange({
        ...shapeProps,
        // reset x,y pair to be without the (coords * scale) of the background in redux state
        x: (node.x() - bgX) / bgScale.width,
        y: (node.y() - bgY) / bgScale.height,
        // set minimal value
        width: Math.max(5, (node.width() * scaleX) / bgScale.width),
        height: Math.max((node.height() * scaleY) / bgScale.height),
      });
    }
  };

  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      if (
        trRef?.current?.nodes &&
        trRef?.current?.getLayer &&
        shapeRef.current
      ) {
        trRef.current.nodes([shapeRef.current]);
        trRef.current.getLayer()?.batchDraw();
      }
    }
  }, [isSelected]);

  return (
    <>
      <Rect
        onClick={onClick}
        onTap={onClick}
        ref={shapeRef}
        {...shapeProps}
        x={(shapeProps.x || 0) * bgScale.width + bgX}
        y={(shapeProps.y || 0) * bgScale.height + bgY}
        class={classItemName}
        onDblClick={onDblClick}
        onDragEnd={(e: any) => {
          onChange({
            ...shapeProps,
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

export default Rectangle;
