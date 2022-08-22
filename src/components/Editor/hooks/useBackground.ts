import useImage from 'use-image';
import { useCallback } from 'react';
type Props = {
  url: string;
  stageWidth: number;
  stageHeight: number;
};

const toolbarAndPanelWidth = 370;
const STAGE_SCALE = 0.25;
const INDICATORS_HEIGHT = 48;

type CalcBgPosition = (arg: {
  width: number;
  height: number;
  heightRatio: number;
  widthRatio: number;
  stageWidth: number;
  stageHeight: number;
}) => {
  bgX: number;
  bgY: number;
};

const calcBgPosition: CalcBgPosition = ({
  width,
  height,
  heightRatio,
  widthRatio,
  stageWidth,
  stageHeight,
}) => {
  stageWidth = stageWidth / STAGE_SCALE;
  const bgWidth = width * widthRatio;
  const maxWidth = Math.max(stageWidth, bgWidth);

  let bgX = (stageWidth - bgWidth) / 2;
  bgX = bgX;

  stageHeight = stageHeight;
  const bgHeight = height * heightRatio * STAGE_SCALE;
  const bgY = (stageHeight - bgHeight) / STAGE_SCALE / 2 + INDICATORS_HEIGHT;

  return {
    bgX,
    bgY,
  };
};

const useBackground = ({ url, stageWidth, stageHeight }: Props) => {
  const [background] = useImage(url);
  let widthRatio = 1,
    heightRatio = 1;

  let width = 0,
    height = 0;
  if (background !== undefined) {
    widthRatio =
      stageWidth > background.width ? stageWidth / background.width : 1;
    heightRatio =
      stageHeight > background.height ? stageHeight / background.height : 1;

    width = background.width;
    height = background.height;
  }
  const { bgX, bgY } = useCallback(
    () =>
      calcBgPosition({
        width,
        height,
        heightRatio,
        widthRatio,
        stageWidth,
        stageHeight,
      }),
    [width, height, heightRatio, widthRatio, stageWidth, stageHeight]
  )();

  console.log({
    width,
    height,
    heightRatio,
    widthRatio,
    stageWidth,
    stageHeight,
    bgX,
    bgY,
  });

  return {
    background,
    widthRatio,
    heightRatio,
    width,
    height,
    bgX,
    bgY,
  };
};

export default useBackground;
