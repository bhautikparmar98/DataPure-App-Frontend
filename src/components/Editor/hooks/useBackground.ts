import useImage from 'use-image';

import { useCallback, useEffect } from 'react';
// import useImgRotation from './useImgRotation';
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
  stageWidth = stageWidth;
  width;
  // const bgWidth = width * widthRatio;
  // const maxWidth = Math.max(stageWidth, width);

  const scale = 8 * Math.min(widthRatio, heightRatio);
  // stageWidth = stageWidth / scale;
  // width = width * scale;
  let bgX = Math.abs((stageWidth + width) / 2) * scale + toolbarAndPanelWidth;

  // const bgHeight = height;
  // const bgHeight = height * heightRatio * STAGE_SCALE;
  // const bgY = (stageHeight - bgHeight) / STAGE_SCALE / 2 + INDICATORS_HEIGHT;
  const bgY = Math.min(stageHeight, height) / 2;

  return {
    bgX,
    bgY,
  };
};

const useBackground = ({ url, stageWidth, stageHeight }: Props) => {
  let [background, backgroundStatus] = useImage(url);
  // const { getRotation, rotation } = useImgRotation();

  // const checkRotation = useCallback(() => {
  //   if (backgroundStatus !== 'loaded') return;
  //   getRotation(background?.src || '');
  // }, [backgroundStatus, background]);

  // useEffect(() => {
  //   if (background && background.src?.length > 0) {
  //     checkRotation();
  //   }
  // }, [background]);

  let widthRatio = 1,
    heightRatio = 1;

  let width = 0,
    height = 0;
  if (background !== undefined) {
    widthRatio = stageWidth / background.width;

    heightRatio = stageHeight / background.height;

    width = background.width;
    height = background.height;
    // background.style.transform = 'rotate(45deg)';
    // background.style.border = '20px solid #ddd';
    // console.log(background);
  }
  let { bgX, bgY } = useCallback(
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

  // bgX = widthRatio < 1 ? bgX + width / 3 : bgX;
  // bgY = heightRatio < 1 ? bgY + width / 2 : bgY;

  // if (rotation === 90) {
  // if img has Orientation 6 EXIF value, then it will be flipped and this is a fix for the bgX for it
  // [bgX, bgY] = [bgY, bgX];
  // [height, width] = [width, height];
  // [widthRatio, heightRatio] = [heightRatio, widthRatio];
  // bgX = bgX + width;
  // }

  return {
    background,
    backgroundStatus,
    widthRatio,
    heightRatio,
    width,
    height,
    bgX,
    bgY,
  };
};

export default useBackground;
