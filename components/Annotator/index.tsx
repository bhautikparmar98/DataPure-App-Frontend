import React, { useEffect, useRef, useState } from 'react';

import { Annotorious } from '@recogito/annotorious';
import ShapeLabelsFormatter from '@recogito/annotorious-shape-labels';
import EnglishImg from './English.png';
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

function Annotator({ imgSrc }: { imgSrc: string }) {
  // Ref to the image DOM element
  const imgEl = useRef<HTMLImageElement>(null);

  // The current Annotorious instance
  const [anno, setAnno] = useState<any>();
  const [isText, setIsText] = useState(true);
  const [hideLabels, setHideLabels] = useState(false);

  // Current drawing tool name
  const [tool, setTool] = useState('rect');

  const [annoId, setAnnoId] = useState('');
  const [imgSnippet, setImgSnippet] = useState({});

  const updateAnnoText = (description: string, annotationID: string) => {
    // const selection
    if (description?.length > 0 && annotationID?.length > 0) {
      const annoToUpdate = anno.getAnnotations(annotationID);
      const annoCopy = JSON.parse(JSON.stringify(annoToUpdate));

      annoCopy.forEach((currentAnnotation: Anno) => {
        if (currentAnnotation.id === annotationID) {
          currentAnnotation.body[0].value = description;
          currentAnnotation.body[0].purpose = 'tagging';
          anno.removeAnnotation(annotationID);
          anno.addAnnotation(currentAnnotation);
        }
      });

      setAnnoId('');
    }
  };

  // OCR Image with Google
  useOCR(imgSnippet, annoId, updateAnnoText);

  // Init Annotorious when the component
  // mounts, and keep the current 'anno'
  // instance in the application state
  useEffect(() => {
    let annotorious = null as any;

    if (imgEl.current) {
      // Init
      annotorious = new Annotorious({
        image: imgEl.current,
        formatter: ShapeLabelsFormatter(),
        // disableEditor: true,
      });

      // annotorious.setVisible(true);

      // Attach event handlers here
      annotorious.on('createAnnotation', (annotation: Anno) => {
        if (isText && annotation?.id) {
          const { snippet } = annotorious.getImageSnippetById(annotation.id);
          setAnnoId(annotation.id);
          setImgSnippet(snippet);
        }
      });

      annotorious.on('createSelection', (annotation: Anno, previous: Anno) => {
        annotation.body = [
          {
            purpose: 'commenting',
            type: 'TextualBody',
            value: 'This snippet will be detected',
          },
        ];
        annotorious.updateSelected(annotation);
      });
    }

    // Keep current Annotorious instance in state
    setAnno(annotorious);

    // Cleanup: destroy current instance
    return () => annotorious.destroy();
  }, []);

  // Toggles current tool + button label
  const toggleTool = () => {
    if (tool === 'rect') {
      setTool('polygon');
      anno.setDrawingTool('polygon');
    } else {
      setTool('rect');
      anno.setDrawingTool('rect');
    }
  };

  return (
    <div
      className={
        hideLabels
          ? 'annotationsContainer labels-hidden'
          : 'annotationsContainer'
      }
    >
      <div style={{ margin: '10px auto', textAlign: 'center' }}>
        <input
          type="checkbox"
          id="annotateText"
          checked={isText}
          onChange={(e) => setIsText((prevState) => !prevState)}
        />

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
        <button onClick={toggleTool}>
          {tool === 'rect' ? 'RECTANGLE' : 'POLYGON'}
        </button>
      </div>

      <img
        ref={imgEl}
        src={EnglishImg.src}
        alt="Annotation"
        style={{ maxWidth: '100%' }}
      />
    </div>
  );
}

export default Annotator;
