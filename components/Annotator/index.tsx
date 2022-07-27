import React, { useEffect, useRef, useState } from 'react';

import { Annotorious } from '@recogito/annotorious';
import ShapeLabelsFormatter from '@recogito/annotorious-shape-labels';
import useOCR from '../../hooks/useOCR';

import '@recogito/annotorious/dist/annotorious.min.css';
import loadAnnos from '../../hooks/loadAnnos';

type Anno = {
  id: string;
  body: {
    purpose: string;
    value: string;
    type: string;
  }[];
};

type TextAnnotation = {
  boundingPoly: {
    vertices: { x: number; y: number }[];
  };
  description: string;
};

type IOCR = {
  payload: {
    textAnnotations: TextAnnotation[];
  };
};

function Annotator({ img }: any) {
  // Ref to the image DOM element
  const imgEl = useRef<HTMLImageElement>(null);
  // The current Annotorious instance
  const [anno, setAnno] = useState<any>();

  const [visibleAnnos, setVisibleAnnos] = useState(true);
  const [showLabels, setShowLabels] = useState(false);

  const [OCR, setOCR] = useState<IOCR>({ payload: { textAnnotations: [] } });

  const updateOCR = (fetchedOCR: any) => {
    setOCR(fetchedOCR);
  };

  const addAnno = (textAnnos: TextAnnotation[]) => {
    const annos = loadAnnos(textAnnos);

    const annotorious = new Annotorious({
      image: imgEl.current,
      formatter: ShapeLabelsFormatter(),
      // disableEditor: true,
    });

    annotorious.setAnnotations(annos);
    annotorious.setVisible(visibleAnnos);
    setAnno(annotorious);
  };

  const handleHideAnnos = () => {
    setVisibleAnnos((prevState) => !prevState);
    anno.setVisible(!visibleAnnos);
  };

  // OCR Image with Google
  useOCR(img, updateOCR);

  useEffect(() => {
    if (OCR.payload?.textAnnotations?.length > 0) {
      addAnno(OCR.payload.textAnnotations);
    }
  }, [OCR.payload.textAnnotations]);

  return (
    <div
      className={
        showLabels
          ? 'annotationsContainer'
          : 'annotationsContainer labels-hidden'
      }
    >
      <div style={{ margin: '10px auto', textAlign: 'center' }}>
        <input
          type="checkbox"
          id="hideAnnos"
          checked={visibleAnnos}
          onChange={handleHideAnnos}
        />
        <label style={{ padding: 5 }} htmlFor="hideAnnos">
          Show Annotations
        </label>

        <input
          type="checkbox"
          id="showLabels"
          checked={showLabels}
          onChange={(e) => setShowLabels((prevState) => !prevState)}
        />
        <label style={{ padding: 5 }} htmlFor="showLabels">
          Show Labels
        </label>
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

export default React.memo(Annotator);
