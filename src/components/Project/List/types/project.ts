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

  // admins
  adminId: number;
}

export interface IProjectClass {
  _id?: string;
  name: string;
  color: string;
}
