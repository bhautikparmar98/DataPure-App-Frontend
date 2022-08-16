import { Rect } from 'react-konva';

type Props = {
  width: number;
  height: number;
  widthRatio: number;
  heightRatio: number;
  background: HTMLImageElement | undefined;
};

const BackgroundImage = ({
  width,
  height,
  background,
  widthRatio,
  heightRatio,
}: Props) => (
  <Rect
    x={-width / 2}
    y={-height / 2}
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
export default BackgroundImage;
