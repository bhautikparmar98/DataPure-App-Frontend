import React, { useEffect, useRef, useState } from 'react';

// import { Annotorious } from '@recogito/annotorious';
// import ShapeLabelsFormatter from '@recogito/annotorious-shape-labels';
// import EnglishImg from './English.png';
import useOCR from '../../hooks/useOCR';

import '@recogito/annotorious/dist/annotorious.min.css';

type Anno = {
  id: string;
  body: {
    purpose: string;
    value: string;
    type: string;
  }[];
};

// import './App.css';

function Annotator({ img }: any) {
  // Ref to the image DOM element
  const imgEl = useRef<HTMLImageElement>(null);

  console.log();
  // The current Annotorious instance
  // const [anno, setAnno] = useState<any>();
  const [isText, setIsText] = useState(true);
  const [hideLabels, setHideLabels] = useState(false);

  // Current drawing tool name
  const [tool, setTool] = useState('rect');

  const [OCR, setOCR] = useState({});

  const updateOCR = (fetchedOCR: any) => {
    setOCR(fetchedOCR);
  };

  // OCR Image with Google
  useOCR(img, updateOCR);

  // Toggles current tool + button label
  // const toggleTool = () => {
  //   if (tool === 'rect') {
  //     setTool('polygon');
  //     anno.setDrawingTool('polygon');
  //   } else {
  //     setTool('rect');
  //     anno.setDrawingTool('rect');
  //   }
  // };

  useEffect(() => {
    console.log(OCR);
  }, [OCR]);

  return (
    <div
      className={
        hideLabels
          ? 'annotationsContainer labels-hidden'
          : 'annotationsContainer'
      }
    >
      <div style={{ margin: '10px auto', textAlign: 'center' }}>
        {/* <input
          type="checkbox"
          id="annotateText"
          checked={isText}
          onChange={(e) => setIsText((prevState) => !prevState)}
        /> */}

        <label style={{ padding: 5 }} htmlFor="annotateText">
          Annotate Text
        </label>

        <input
          type="checkbox"
          id="hideLabels"
          checked={hideLabels}
          onChange={(e) => setHideLabels((prevState) => !prevState)}
        />
        <label style={{ padding: 5 }} htmlFor="hideLabels">
          Hide Labels
        </label>
        {/* <button onClick={toggleTool}>
          {tool === 'rect' ? 'RECTANGLE' : 'POLYGON'}
        </button> */}
      </div>
      {img && (
        <img
          ref={imgEl}
          src={URL.createObjectURL(img)}
          alt="Annotation"
          style={{ maxWidth: '100%' }}
        />
      )}
    </div>
  );
}

export default Annotator;
