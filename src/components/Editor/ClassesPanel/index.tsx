import { FC, memo, useCallback, useEffect, useState } from 'react';
// MUI
import { Button, Container, TextField } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import Iconify from 'src/components/Shared/Iconify';
import { updateAnnotation } from 'src/redux/slices/classes/classes.slice';
import Filters from './Filters';
import Preview from './Preview';
import RequestRedo from './RequestRedo';
import SubmitAnnotations from './SubmitAnnotations';

import { useDispatch } from 'react-redux';
import Annotations from './Annotations';
import useAnnotationSubmit from './hooks/useAnnotationSubmit';
import useAttributes from './hooks/useAttributes';
import useSortedClasses from './hooks/useSortedClasses';
import ToggleSwitch from './ToggleSwitch/ToggleSwitch';

interface ClassPanelProps {
  onRequestRedoFinish: (imgId: string) => void;
  annotationId: String | undefined;
}

interface Checks {
  [instanceId: string]: boolean;
}

const ClassPanel: FC<ClassPanelProps> = ({ onRequestRedoFinish, annotationId }) => {
  const { sortedClasses, sortBy, lastSortType } = useSortedClasses();
  const [selectedAnnotationData, setSelectedAnnotationData] = useState<any>({});
  const dispatch = useDispatch();

  const { handleSubmit, handleReset, handleApproveImage } = useAnnotationSubmit();

  const [checks, setChecks] = useState<Checks>({});

  const updateFiltersChecks = useCallback((newChecks: Checks) => setChecks(newChecks), [checks]);

  const { project } = useAttributes();

  // switch management
  const [Switchs, setSwitch] = useState('Annotation');

  const handleChange = (chosenTab: string) => {
    annotationId && setSwitch(chosenTab);
  };

  //
  const getAnnotationMetaData = (id: String) => {
    const classesWithAnnotations = sortedClasses.filter((data) => data.annotations.length);
    let selectedAnnotationIndex = 0;
    const selectedClass = classesWithAnnotations.filter(
      (classItem) =>
        classItem.annotations.filter((data, index) => {
          if (data?.shapes[0]?.id === id) {
            selectedAnnotationIndex = index;
            return true;
          }
        })?.length
    );
    let annotation = selectedClass[0]?.annotations[selectedAnnotationIndex];

    if (!annotation?.attributes) {
      let preAnnotation = {};
      if (project?.attributes) {
        project.attributes.map((attribute) => {
          preAnnotation = {
            ...preAnnotation,
            [attribute.metaname]: attribute.defaultValue,
          };
        });
      }
      annotation = {
        ...annotation,
        attributes: preAnnotation,
      };
    }

    //if there are attributes limited for specific classes and the selected annotation's class is not included, we will omit it here
    if (project?.attributes) {
      let attributes = {};
      project.attributes.forEach((attr) => {
        //if this attr is limited to specific class
        if (attr.classes?.length > 0 && selectedClass[0].name !== attr.classes) return;
        attributes = {
          ...attributes,
          [attr.metaname]: annotation.attributes ? annotation?.attributes[attr.metaname] || '' : attr.defaultValue,
        };
      });
      annotation = { ...annotation, attributes };
    }

    setSelectedAnnotationData(annotation);
  };

  const handleAttributesSubmit = () => {
    selectedAnnotationData?.attributes &&
      Object.keys(selectedAnnotationData.attributes).map((metadata) => {
        if (metadata) {
          dispatch(
            updateAnnotation({
              classId: selectedAnnotationData.classId,
              annotationId: selectedAnnotationData.id,
              update: {
                attributes: {
                  [metadata]: (selectedAnnotationData && (selectedAnnotationData as any)?.attributes[metadata]) || '',
                },
              },
            })
          );
        }
      });
    handleSubmit(false, selectedAnnotationData);
  };

  useEffect(() => {
    !annotationId?.length && setSwitch('Annotation');
    annotationId?.length && getAnnotationMetaData(annotationId);
  }, [annotationId]);

  return (
    <div style={{ cursor: 'default' }}>
      <Drawer
        variant="permanent"
        anchor={'right'}
        open={true}
        PaperProps={{
          sx: {
            backgroundColor: '#F6F6F6',
          },
        }}>
        <Container
          sx={{
            width: 330,
            paddingTop: 2,
            paddingBottom: 4,
            minHeight: 'max(98vh, 800px)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}>
          <RequestRedo onRequestRedoFinish={onRequestRedoFinish} />
          <ToggleSwitch onChangeHandler={handleChange} value={Switchs} />

          {Switchs === 'Annotation' ? (
            <>
              <Preview />
              <Filters checks={checks} sortBy={sortBy} />
              <Annotations classes={sortedClasses} updateFiltersChecks={updateFiltersChecks} />
            </>
          ) : selectedAnnotationData?.attributes && Object.keys(selectedAnnotationData.attributes).length ? (
            <>
              {Object.keys(selectedAnnotationData.attributes).map((metadata) => {
                return (
                  <TextField
                    label={metadata}
                    name={metadata}
                    fullWidth
                    sx={{
                      marginRight: '10px',
                      marginTop: '30px',
                      '.MuiFormHelperText-root': {
                        color: '#FF4842',
                        ml: '2px',
                        mt: '30px',
                      },
                    }}
                    onChange={(e: any) => {
                      let _tempSelectedAnnotationData = {
                        ...selectedAnnotationData.attributes,
                      };
                      _tempSelectedAnnotationData = {
                        ..._tempSelectedAnnotationData,
                        [e.target.name]: e.target.value,
                      };
                      let _tempAnnotationData = { ...selectedAnnotationData };
                      _tempAnnotationData.attributes = _tempSelectedAnnotationData;
                      setSelectedAnnotationData(_tempAnnotationData);
                    }}
                    value={selectedAnnotationData ? (selectedAnnotationData as any)!.attributes[metadata]! || '' : ''}
                  />
                );
              })}
              <Button
                sx={{ mt: 4 }}
                variant="contained"
                onClick={(e) => handleAttributesSubmit()}
                startIcon={<Iconify icon={'ic:outline-done'} />}>
                Save
              </Button>
            </>
          ) : (
            <></>
          )}

          <SubmitAnnotations
            handleSubmit={handleSubmit}
            handleReset={handleReset}
            handleApproveImage={handleApproveImage}
            newAnnotationData={selectedAnnotationData}
          />
        </Container>
      </Drawer>
    </div>
  );
};
export default memo(ClassPanel);
