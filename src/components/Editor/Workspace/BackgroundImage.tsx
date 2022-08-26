import Konva from 'konva';
import { useRef } from 'react';
import { Rect } from 'react-konva';

type Props = {
  width: number;
  height: number;
  x: number;
  y: number;
  widthRatio: number;
  heightRatio: number;
  background: HTMLImageElement | undefined;
  backgroundStatus: string;
  rotation: number;
};

const BackgroundImage = ({
  width,
  height,
  x,
  y,
  background,
  widthRatio,
  heightRatio,
  rotation,
}: Props) => {
  const rectRef = useRef<Konva.Rect | null>(null);

  return (
    <Rect
      ref={rectRef}
      // !Fix this
      // x={x + (rotation === 90 ? width : 0)}
      x={x}
      y={y}
      width={width * widthRatio}
      height={height * heightRatio}
      rotation={rotation}
      fillPatternImage={background}
      fillPatternRepeat={'no-repeat'}
      // fillPatternScaleX={widthRatio}
      // fillPatternScaleY={heightRatio}
      id="canvasBackground"
      listening={false}
    />
  );
};
export default BackgroundImage;
