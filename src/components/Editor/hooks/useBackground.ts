import useImage from 'use-image';

type Props = {
  url: string;
  width: number;
  height: number;
};

const useBackground = ({ url, width, height }: Props) => {
  const [background] = useImage(url);
  let widthRatio = 1,
    heightRatio = 1;

  if (background !== undefined) {
    widthRatio = width > background.width ? width / background.width : 1;
    heightRatio = height > background.height ? height / background.height : 1;

    width = background.width;
    height = background.height;
  }
  return {
    background,
    widthRatio,
    heightRatio,
    width,
    height,
  };
};

export default useBackground;
