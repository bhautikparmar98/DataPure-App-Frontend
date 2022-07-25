import { useEffect, useRef, useState } from 'react';

// import GermanImg from '/German.png';
import useOCR from '../hooks/useOCR';

import '@recogito/annotorious/dist/annotorious.min.css';

// import './ocr.css';

type Annotation = {
  id: string;
  body: {
    value: string;
    type: string;
    purpose: string;
  }[];
};

function Ocr({ imgSrc }: { imgSrc: string }) {
  // Ref to the image DOM element
  const imgRef = useRef<HTMLImageElement>(null);

  // The current Annotorious instance
  const [mounted, setMounted] = useState(false);
  const [Annotorious, setAnnotorious] = useState({});
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
      const annoCopy: Annotation[] = JSON.parse(JSON.stringify(annoToUpdate));

      annoCopy.forEach((currentAnnotation) => {
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

  // Annotorious needs to be Dynamically loaded to not be imported on Next.js Server
  useEffect(() => {
    const getAnnoLib = async () => {
      const Lib = await import('@recogito/annotorious');
      const ShapeLabelsFormatter = (
        await import('@recogito/annotorious-shape-labels')
      ).default;
      (await import('@recogito/annotorious-shape-labels')).default;

      if (Lib.Annotorious && imgRef.current) {
        let res = new Lib.Annotorious({
          image: imgRef.current,
          formatter: ShapeLabelsFormatter(),
          // disableEditor: true,
        });
        setAnnotorious(res);
        console.log(Annotorious);
        setMounted(true);
      }
    };
    getAnnoLib();
  }, [imgRef.current]);

  // Init Annotorious when the component
  // mounts, and keep the current 'anno'
  // instance in the application state
  useEffect(() => {
    let annotorious = null as any;
    if (mounted) {
      console.log(mounted, Annotorious);
      if (imgRef.current) {
        // Init
        annotorious = Annotorious;
        // annotorious.setVisible(true);

        // Attach event handlers here
        annotorious.on('createAnnotation', (annotation: Annotation) => {
          if (isText && annotation?.id) {
            const { snippet } = annotorious.getImageSnippetById(annotation.id);
            setAnnoId(annotation.id);
            setImgSnippet(snippet);
          }
        });

        annotorious.on(
          'createSelection',
          (annotation: Annotation, previous: Annotation) => {
            annotation.body = [
              {
                purpose: 'commenting',
                type: 'TextualBody',
                value: 'This snippet will be detected',
              },
            ];
            annotorious.updateSelected(annotation);
          }
        );
      }

      // Keep current Annotorious instance in state
      setAnno(annotorious);
    }

    // Cleanup: destroy current instance
    // return () => annotorious.destroy();
  }, [mounted, Annotorious]);

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
        ref={imgRef}
        src={imgSrc}
        alt="Hallstatt Town Square"
        style={{ maxWidth: '100%' }}
      />
    </div>
  );
}

export default Ocr;
