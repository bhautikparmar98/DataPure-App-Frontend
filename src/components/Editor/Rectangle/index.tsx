import Konva from 'konva';
import { useEffect, useRef } from 'react';
import { Rect, Transformer } from 'react-konva';

const Rectangle = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
  onMouseEnter,
  onMouseLeave,
  onDblClick,
}) => {
  const shapeRef = useRef<Konva.Rect>();
  const trRef = useRef<Konva.Transformer>();

  const handleTransformEnd = (e) => {
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
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onDblClick={onDblClick}
        onDragEnd={(e) => {
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
