export const IMAGE_STATUS = {
  PENDING_ANNOTATION: {
    value: 'PENDING_ANNOTATION',
    label: 'Ready for Annotation',
    color: 'default',
  },
  ANNOTATION_INPROGRESS: {
    value: 'ANNOTATION_INPROGRESS',
    label: 'Annotation InProgress',
    color: 'warning',
  },
  PENDING_QA: {
    value: 'PENDING_QA',
    label: 'Ready for QA',
    color: 'primary',
  },
  PENDING_REDO: {
    value: 'PENDING_REDO',
    label: 'Ready for Re-Work',
    color: 'error',
  },
  PENDING_CLIENT_REVIEW: {
    value: 'PENDING_CLIENT_REVIEW',
    label: 'Ready for Client Review',
    color: 'info',
  },
  DONE: {
    value: 'DONE',
    label: 'Done',
    color: 'success',
  },
};
