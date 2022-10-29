import { parseJsonFile } from 'src/utils/parseJsonFile';

interface Annotation {
  image_id: number;
  id: number;
  category_id: number;
  segmentation: number;
  area: number;
  bbox: number[];
  iscrowd: number;
}

interface Image {
  license: number;
  file_name: string;
  width: number;
  height: number;
  id: string;
}

interface Files {
  info: { [key: string]: string };
  licenses: any[];
  categories: {
    id: number;
    name: string;
  }[];
  images: Image[];
  annotations: Annotation[];
}

const mergeMultiAnnotations = async (jsonFiles: Blob[]) => {
  const promises = jsonFiles.map((json) => parseJsonFile(json));

  const files: Files[] = await Promise.all(promises);

  const { categories, licenses, info } = files[0];
  const mergedSchema = {
    categories,
    licenses,
    info,
    images: [] as Image[],
    annotations: [] as unknown as Annotation[],
  };

  for (let i = 0; i < files.length; i++) {
    let { images, annotations } = files[i];

    let imgMap: { [imgId: string]: string } = {};
    images.forEach((img) => {
      imgMap[img.id] = `${img.id}-${img.file_name}`;
    });
    images = images.map((img) => {
      img.id = imgMap[img.id];
      return img;
    });

    annotations = annotations.map((anno: any) => {
      anno.id = `${imgMap[anno.image_id]}-anno-${anno.id}`;
      anno.image_id = imgMap[anno.image_id];
      return anno;
    });
    mergedSchema.images.push(...images);
    mergedSchema.annotations.push(...annotations);
  }

  return mergedSchema;
};

export default mergeMultiAnnotations;
