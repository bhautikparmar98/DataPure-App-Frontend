import { useEffect, useRef, memo } from 'react';
import { Image } from 'react-konva';
type Props = {
  width: number;
  height: number;
  x: number;
  y: number;
  background: HTMLImageElement | undefined;
};

const BackgroundImage = ({ width, height, x, y, background }: Props) => {
  const bgRef = useRef<any>(null);
  useEffect(() => {
    if (width > 0) bgRef?.current?.cache();
  }, [width]);
  return (
    <Image
      ref={bgRef}
      x={x}
      y={y}
      width={width}
      height={height}
      image={background}
      id="canvasBackground"
      listening={false}
    />
  );
};
export default memo(BackgroundImage);
