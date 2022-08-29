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
  // rotation: number;
};

const BackgroundImage = ({
  width,
  height,
  x,
  y,
  background,
  widthRatio,
  heightRatio,
}: // rotation,
Props) => {
  const rectRef = useRef<Konva.Rect | null>(null);
  // console.log({ widthRatio, heightRatio });
  return (
    <Rect
      ref={rectRef}
      // !Fix this
      // x={x + (rotation === 90 ? width : 0)}
      x={x}
      y={y}
      width={width}
      height={height}
      // rotation={90}
      fillPatternImage={background}
      fillPatternRepeat={'no-repeat'}
      // fillPatternScaleX={widthRatio}
      // fillPatternScaleY={heightRatio}
      // scaleX={Math.max(widthRatio, heightRatio)}
      // scaleY={Math.max(widthRatio, heightRatio)}
      id="canvasBackground"
      listening={false}
    />
  );
};
export default BackgroundImage;
