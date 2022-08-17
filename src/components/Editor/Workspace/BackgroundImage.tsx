import { Rect } from 'react-konva';

type Props = {
  width: number;
  height: number;
  x: number;
  y: number;
  widthRatio: number;
  heightRatio: number;
  background: HTMLImageElement | undefined;
};

const BackgroundImage = ({
  width,
  height,
  x,
  y,
  background,
  widthRatio,
  heightRatio,
}: Props) => {
  return (
    <Rect
      x={x}
      y={y}
      width={width}
      height={height}
      fillPatternImage={background}
      fillPatternRepeat={'no-repeat'}
      fillPatternScaleX={widthRatio}
      fillPatternScaleY={heightRatio}
      id="canvasBackground"
      listening={false}
    />
  );
};
export default BackgroundImage;
