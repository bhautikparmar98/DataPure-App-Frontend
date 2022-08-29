import EXIF from 'exif-js';
import { useState } from 'react';
import axios from 'axios';

// exif data rotation reference: https://sirv.com/help/articles/rotate-photos-to-be-upright/#:~:text=EXIF%20rotation%20values,-The%208%20EXIF&text=%3D%20180%20degrees%3A%20image%20is%20upside,image%20is%20on%20its%20side.
const ROTATION = [0, 0, 180, 180, 90, 90];

// Some images are rotated and to get the values of rotation, we are accessing it through its EXIF Data
function useImageRotation() {
  const [rotation, setRotation] = useState(0);
  const getRotation = (src: string) => {
    fetch(src, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'image/png',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    })
      .then((response) => response.blob())
      .then((data) => {
        EXIF.getData(data as any, () => {
          var exifData = EXIF.pretty(data);
          if (exifData) {
            const orientationLabel = EXIF.getTag(data, 'Orientation');
            if (typeof orientationLabel === 'number')
              setRotation(ROTATION[orientationLabel - 1] || 0);
          }
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return { getRotation, rotation };
}

export default useImageRotation;
