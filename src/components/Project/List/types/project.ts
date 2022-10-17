export interface IProject {
  _id?: string;
  name: string;
  dueAt: Date;
  type: string;
  classes: IProjectClass[];
  imagesIds: string[];
  userId: number;

  // status static
  imagesCount: number;
  annotationCount: number;
  qaCount: number;
  clientReviewCount: number;
  doneCount: number;
  finished?: boolean;

  // admins
  adminId: number;

  attributes: IProjectMeataData[];

  assignedAnnotators: number[];
  assignedQAs: number[];
}

export interface IProjectClass {
  _id?: string;
  name: string;
  color: string;
}

export interface IProjectMeataData {
  metaname: string;
  metatype: string;
  displayName: string;
  classes: string;
  maxCharacters: number;
  defaultValue: string;
  descriptions: string;
  required: boolean;
}