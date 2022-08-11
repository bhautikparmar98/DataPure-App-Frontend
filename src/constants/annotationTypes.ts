export const ANNOTATION_TYPES = {
  IMAGE_ANNOTATION: {
    value: 'IMAGE_ANNOTATION',
    label: 'Image',
  },
  TEXT_ANNOTATION: {
    value: 'TEXT_ANNOTATION',
    label: 'Text',
  },
};

export type AnnotationTypeKey = keyof typeof ANNOTATION_TYPES;
