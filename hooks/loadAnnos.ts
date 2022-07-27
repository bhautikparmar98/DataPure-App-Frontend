import _ from 'underscore';

type GoogleTextAnnotation = {
  boundingPoly: {
    vertices: { x: number; y: number }[];
  };
  description: string;
}[];

// Convert Google text annotations to Annatorious library W3C standard structure
const loadAnnos = (annos: GoogleTextAnnotation) => {
  if (annos && annos.length > 0) {
    // skipping annos[0] as it's the ocr description of the whole image
    const newAnnos = annos.slice(1).map((anno) => {
      const { vertices } = anno.boundingPoly;
      const x = vertices[0].x;
      const y = vertices[0].y;
      const w = vertices[1].x - x;
      const h = vertices[3].y - y;
      return {
        '@context': 'http://www.w3.org/ns/anno.jsonld',
        id: _.uniqueId('anno_'),
        type: 'Annotation',
        body: [
          {
            value: anno.description,
            type: 'TextualBody',
            purpose: 'tagging',
          },
        ],
        target: {
          selector: [
            {
              type: 'FragmentSelector',
              conformsTo: 'http://www.w3.org/TR/media-frags/',
              value: `xywh=pixel:${x},${y},${w},${h}`,
            },
          ],
        },
      };
    });
    return newAnnos;
  }
};
export default loadAnnos;
