import useImage from 'use-image';

// import useImgRotation from './useImgRotation';
type Props = {
  url: string;
  stageWidth: number;
  stageHeight: number;
};

// const toolbarAndPanelWidth = 370;
// const STAGE_SCALE = 0.25;
// const INDICATORS_HEIGHT = 48;

const useBackground = ({ url, stageWidth, stageHeight }: Props) => {
  let [background, backgroundStatus] = useImage(url);

  let widthRatio = 1,
    heightRatio = 1;

  let width = 0,
    height = 0;

  let bgScale = {
    width: 1,
    height: 1,
  };

  if (background !== undefined) {
    widthRatio = stageWidth / background.width;

    heightRatio = stageHeight / background.height;

    width = background.width;
    height = background.height;

    //if width > height ==> set width to the stageWidth and use its ratio to set the height and the vice versa
    width = background.width >= height ? stageWidth : heightRatio * width;
    height = background.width >= height ? widthRatio * height : stageHeight;

    //this scale is used to make shapes responsive on user screens. Used to scale shapes according to the background dimensions
    bgScale = {
      width: width / background.width,
      height: height / background.height,
    };
  }

  let bgX = (stageWidth - width) / 2;
  const bgY = (stageHeight - height) / 2;

  return {
    background,
    backgroundStatus,
    widthRatio,
    heightRatio,
    width,
    height,
    bgX,
    bgY,
    bgScale,
  };
};

export default useBackground;
