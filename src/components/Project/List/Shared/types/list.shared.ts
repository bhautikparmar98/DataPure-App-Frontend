import { proertiesProps } from '../MetaPropertyTypeView/MetaCreatePropertyView';
import { IProjectMeataData } from '../../types/project';

export interface metricTypes {
  editable: boolean;
  metric_datatype: string;
  metric_display_name: string;
  metric_name: string;
  required: boolean;
  values: string;
}

export interface prpertiesValuesTypes {
  name: string;
  type: string;
}

export interface MetaPropertiesEditViewProps {
  rawData: metricTypes;
  cellData: prpertiesValuesTypes;
}

export interface MetaPropertiesViewProps {
  list: IProjectMeataData[];
  open: boolean;
  setOpen: (e: any) => void;
  setOpenListView: (e: any) => void;
}

export interface MetaPropertiesCreateViewProps {
  open: boolean;
  error: boolean;
  setError: (e: any) => void;
  setOpen: (e: any) => void;
  saveProperty: (e: any, projectId: string) => void;
}
