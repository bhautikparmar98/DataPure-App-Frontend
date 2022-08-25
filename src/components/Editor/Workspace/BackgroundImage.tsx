import Konva from 'konva';
import { useCallback, useEffect, useRef } from 'react';
import { Rect } from 'react-konva';
import useImgOrientation from '../hooks/useImgOrientation';

type Props = {
  width: number;
  height: number;
  x: number;
  y: number;
  widthRatio: number;
  heightRatio: number;
  background: HTMLImageElement | undefined;
  backgroundStatus: string;
};

const BackgroundImage = ({
  width,
  height,
  x,
  y,
  background,
  widthRatio,
  heightRatio,
  backgroundStatus,
}: Props) => {
  const rectRef = useRef<Konva.Rect | null>(null);

  const { getOrientation, orientation } = useImgOrientation();

  const checkOrientation = () => {
    if (background?.complete && background.width > 0) {
      const img = new Image();
      img.onload = async () => {
        getOrientation(img);
      };
      img.src = background.src;
    }
  };

  useEffect(() => {
    if (backgroundStatus === 'loaded' && rectRef?.current) checkOrientation();
  }, [background]);

  return (
    <Rect
      ref={rectRef}
      // !Fix this
      x={x + width}
      y={y}
      width={width * widthRatio}
      height={height * heightRatio}
      rotation={orientation}
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
