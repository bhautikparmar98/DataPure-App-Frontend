import Konva from 'konva';
import { useState } from 'react';
import { TOOLS } from 'src/constants';

const useTooltip = (stageRef: React.RefObject<Konva.Stage>) => {
  const [tooltip, setTooltip] = useState({
    x: 0,
    y: 0,
    text: '',
    fontSize: 14,
    fill: 'rgba(0,0,0,1)',
    fontFamily: 'Calibri',
    rectWidth: 40,
  });

  const showTooltip = (e: any) => {
    const layerTitle: string = e.target?.attrs?.layer;
    const { type, points } = e.target.attrs;
    const { x, y } = e.target.getClientRect({
      relativeTo: stageRef.current,
    });

    if (
      typeof layerTitle === 'string' &&
      typeof x === 'number' &&
      typeof y === 'number'
    ) {
      let actualX = x;
      let actualY = y - 25;
      if (type === TOOLS.LINE) {
        //points odd indexes are the x values and the even ones are for the y ones
        const xArr: number[] = [];
        const yArr: number[] = [];
        points.forEach((point: number, i: number) => {
          if (i % 2 === 0) return xArr.push(point);
          yArr.push(point);
        });

        // when line moves, the points values will be the same, but the displacement will be represented in `x` and `y` values
        // actualX = Math.min(...xArr) + x;
        const minY = Math.min(...yArr);
        const minYIndex = yArr.indexOf(minY);
        const correspondX = xArr[minYIndex];
        const correspondXIndex = xArr.indexOf(correspondX);
        //we want x that is correspondent to minY
        actualX = points[correspondXIndex + minYIndex];

        const { x = 0, y = 0 } = e.target.attrs;
        actualX = actualX + x + 10;
        actualY = minY + y - 20;
      }

      const rectWidth =
        e.evt?.srcElement?.getContext('2d')?.measureText(layerTitle)?.width *
          1.4 +
          10 || 40;

      setTooltip((prev) => ({
        ...prev,
        x: actualX,
        y: actualY,
        text: layerTitle,
        fill: '#fff',
        rectWidth,
      }));
    }
  };

  const hideTooltip = () => {
    setTooltip({
      x: 0,
      y: 0,
      text: '',
      fontSize: 14,
      fill: 'rgba(0,0,0,1)',
      fontFamily: 'Calibri',
      rectWidth: 40,
    });
  };

  return {
    tooltip,
    showTooltip,
    hideTooltip,
  };
};

export default useTooltip;
