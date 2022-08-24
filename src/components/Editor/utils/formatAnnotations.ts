import { Annotation, Rectangle, TOOLS } from 'src/constants';
import uniqid from 'uniqid';

interface ImageAnno {
  image_id: number;
  id: number;
  category_id: number;
  segmentation: number;
  area: number;
  bbox: number[];
  iscrowd: number;
}

interface ImageData {
  [key: string]: {
    shape: Rectangle;
    category_id: number;
    id: number;
  }[];
}

interface AnnoData {
  annotations: ImageAnno[];
  images: {
    license: number;
    file_name: string;
    width: number;
    height: number;
    id: number;
  }[];
}

export const formatAnnotations = (data: AnnoData) => {
  const { annotations, images } = data;
  console.log({ annotations });

  const imagesData: ImageData = {};

  annotations.forEach((anno: ImageAnno) => {
    imagesData[anno.image_id] = imagesData[anno.image_id]
      ? imagesData[anno.image_id]
      : [];
    imagesData[anno.image_id].push({
      category_id: anno.category_id,
      id: anno.id,
      shape: {
        id: uniqid(),
        x: anno.bbox[0],
        y: anno.bbox[1],
        width: anno.bbox[2],
        height: anno.bbox[3],
        type: TOOLS.RECTANGLE,
        points: [],
      },
    });
  });

  interface State {
    images: {
      _id: string;
      src: string;
      fileName: string;
      annotations: Annotation[];
      project: any;
    }[];
  }
  const state: State = {
    images: [],
  };

  Object.keys(imagesData).forEach((imageId, i) => {
    const image = images.find((img) => img.id === +imageId);

    state.images[i] = {
      _id: imageId,
      src: '/images/project_upload/' + image?.file_name || '',
      fileName: image?.file_name || '',
      annotations: imagesData[imageId].map((img) => ({
        visible: true,
        id: uniqid(),
        classId: '1',
        shapes: [img.shape],
        imageId,
      })),
      project: {
        _id: uniqid(),
        classes: [
          {
            _id: '1',
            id: '1',
            color: 'rgb(100,0,100)',
            name: 'Metals',
          },
        ],
      },
    };
  });

  return {
    data: {
      images: state.images,
    },
  };
};
