import { Box, Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import axiosInstance from 'src/utils/axios';
import { IProject } from '../../types/project';
import MetaAddNewPropertiesView from '../MetaPropertyTypeView/MetaCreatePropertyView';
import MetaPropertiesList from '../MetaPropertyTypeView/MetaPropertyCellView';

interface proertiesProps {
  name: string;
  type: string;
  displayName: string;
  classes: string;
  maxCharacters: number;
  defaultValue: string;
  descriptions: string;
  required: boolean;
  setOpenListView:()=>void;
  openlistView: boolean
}

interface MetaDataCreationProps {
  project: IProject;
  syncProjectData: any;
  setOpenListView: any;
  openlistView: boolean;
}

const MetaDataCreationModel: React.FC<MetaDataCreationProps> = ({ project, syncProjectData, setOpenListView, openlistView }) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  const savePropertiesHandler = async (data: proertiesProps) => {
    try {
      const response = await axiosInstance.put(`/project/${project._id}/metadata`, data);
      syncProjectData();
      enqueueSnackbar('Property added successfully', { variant: 'success' });
      setOpen(false);
      setOpenListView(false);
    } catch (error) {
      console.log('error', error);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };

  return (
    <Box>
      {/* <Button variant={'contained'} color={'primary'} onClick={() => setOpenListView(!openlistView)} size={'small'}>
        {'Meta data'}
      </Button> */}
      <MetaPropertiesList
        list={project.attributes}
        open={openlistView}
        setOpen={() => setOpen(true)}
        setOpenListView={() => setOpenListView(false)}
      />
      <MetaAddNewPropertiesView
        open={open}
        error={error}
        setError={(value) => setError(value)}
        setOpen={() => {
          setOpen(false);
          setError(false);
        }}
        project={project}
        saveProperty={savePropertiesHandler}
      />
    </Box>
  );
};

export default MetaDataCreationModel;
