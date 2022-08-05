import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { Stage } from 'konva/lib/Stage';
import { useEffect, useRef } from 'react';
import { Rect, Transformer } from 'react-konva';

interface IRectangle {
  shapeProps: Konva.ShapeConfig;
  isSelected: boolean;
  layer: string;
  onSelect: (e: KonvaEventObject<Event>) => void;
  onChange: (e: Konva.ShapeConfig) => void;
  onMouseEnter: (e: KonvaEventObject<MouseEvent>) => void;
  onMouseLeave: (e: KonvaEventObject<MouseEvent>) => void;
  onDblClick: (e: KonvaEventObject<MouseEvent>) => void;
}

const Rectangle = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
  onMouseEnter,
  onMouseLeave,
  onDblClick,
  layer,
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
        x: node.x(),
        y: node.y(),
        // set minimal value
        width: Math.max(5, node.width() * scaleX),
        height: Math.max(node.height() * scaleY),
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
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        layer={layer}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onDblClick={onDblClick}
        onDragEnd={(e: any) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={handleTransformEnd}
      />
      {isSelected && (
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
