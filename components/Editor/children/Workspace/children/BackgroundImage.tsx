import { Rect } from 'react-konva';
import useImage from 'use-image';

type Props = { url: string; width: number; height: number };

const BackgroundImage = ({ url, width, height }: Props) => {
  const [background] = useImage(url);
  let widthRatio = 1,
    heightRatio = 1;

  if (background !== undefined) {
    widthRatio = width / background.width;
    heightRatio = height / background.height;
  }

  return (
    <Rect
      x={0}
      y={0}
      width={width}
      height={height}
      fillPatternImage={background}
      fillPatternRepeat={'no-repeat'}
      fillPatternScaleX={widthRatio}
      fillPatternScaleY={heightRatio}
      id="canvasBackground"
    ></Rect>
  );
};
export default BackgroundImage;
