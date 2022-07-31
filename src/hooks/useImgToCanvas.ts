import React, { useEffect } from 'react';

type UseImgToCanvas = (
  imgSrc: string,
  canvasRef: React.RefObject<HTMLCanvasElement>
) => void;

const useImgToCanvas: UseImgToCanvas = (imgSrc, canvasRef) => {
  useEffect(() => {
    const img = new Image();

    img.src = imgSrc;
    img.alt = 'Innovative';

    img.onload = function () {
      const imgContext = canvasRef.current?.getContext('2d');
      if (canvasRef.current && imgContext) {
        canvasRef.current.width = img.width;
        canvasRef.current.height = img.height;

        imgContext.drawImage(img, 0, 0, img.width, img.height);
        // Save image as a data URL
        const imgInfo = canvasRef.current.toDataURL('image/png');
        localStorage.setItem('imgInfo', imgInfo);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgSrc, canvasRef.current]);
};

export default useImgToCanvas;
