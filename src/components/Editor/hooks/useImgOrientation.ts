import EXIF from 'exif-js';
import { useState } from 'react';

// exif data orientation reference: https://sirv.com/help/articles/rotate-photos-to-be-upright/#:~:text=EXIF%20orientation%20values,-The%208%20EXIF&text=%3D%20180%20degrees%3A%20image%20is%20upside,image%20is%20on%20its%20side.
const ROTATION = [0, 0, 180, 180, 90, 90];

// Some images are rotated and to get the values of rotation, we are accessing it through its EXIF Data
function useImgOrientation() {
  const [orientation, setOrientation] = useState(0);

  const getOrientation = (img: HTMLImageElement) => {
    try {
      EXIF.getData(img as any, () => {
        var exifData = EXIF.pretty(img);
        if (exifData) {
          const orientationLabel = EXIF.getTag(img, 'Orientation');

          if (typeof orientationLabel === 'number')
            setOrientation(ROTATION[orientationLabel - 1] || 0);
        }
      });
    } catch (err) {}
  };
  return { getOrientation, orientation };
}

export default useImgOrientation;
