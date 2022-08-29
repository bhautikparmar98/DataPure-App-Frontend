import { Image } from 'react-konva';

type Props = {
  width: number;
  height: number;
  x: number;
  y: number;
  background: HTMLImageElement | undefined;
};

const BackgroundImage = ({ width, height, x, y, background }: Props) => {
  return (
    <Image
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
export default BackgroundImage;
