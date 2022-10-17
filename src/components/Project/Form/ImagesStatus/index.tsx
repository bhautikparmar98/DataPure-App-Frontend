import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import Iconify from 'src/components/Shared/Iconify';
import Label from 'src/components/Shared/Label';
import Scrollbar from 'src/components/Shared/Scrollbar';
import { TOOLS } from 'src/constants';

interface ImagesStatusProps {
  open: boolean;
  onClose: () => void;
  onDelete: (row: any) => void;
  onApprove: (data: any) => void;
  images: any[];
  jsonData: any;
  classes: any[];
  loading: boolean;
}

const ImagesStatus: React.FC<ImagesStatusProps> = ({
  open,
  onClose,
  onApprove,
  images,
  jsonData,
  onDelete,
  classes,
  loading,
}) => {
  const [rows, setRows] = useState<any>([]);
  const [
    numberOfAnnotationsWithOutImages,
    setNumberOfAnnotationsWithOutImages,
  ] = useState(0);

  useEffect(() => {
    const buildRows = () => {
      const imgIdMap: any = {};

      const imagesWithNoData: any[] = [];
      let annotationsWithNoImages = 0;

      images.forEach((img) => {
        const jsonImg = jsonData.images.filter(
          (i: { file_name: string }) => i.file_name === img.name
        );

        if (jsonImg.length > 0) {
          // get annotations for that image and convert it to our system
          const imgAnnotations = jsonData.annotations
            .filter((a: any) => a.image_id === jsonImg[0].id)
            .map((anno: any) => ({
              x: anno.bbox[0],
              y: anno.bbox[1],
              width: anno.bbox[2],
              height: anno.bbox[3],
              id: anno.id,
              type: TOOLS.RECTANGLE,
              attributes: anno.attributes,
              classId: anno.category_id,
            }));

          imgIdMap[jsonImg[0].id] = {
            uploadedImage: img,
            jsonImg: jsonImg[0],
            annotations: imgAnnotations,
            count: 0,
          };
          // debugger;
        } else imagesWithNoData.push(img);
      });

      const newRows = Object.values(imgIdMap).map((i: any) => ({
        name: i.uploadedImage.name,
        image: i.uploadedImage,
        annotations: i.annotations,
        exist: true,
      }));

      jsonData.annotations.forEach((anno: any) => {
        if (!imgIdMap[anno.image_id]) annotationsWithNoImages++;
      });

      newRows.push(
        ...imagesWithNoData.map((k) => ({
          name: k.name,
          image: k.uploadedImage,
          // new images does not have pre-annotations
          annotations: [],
          exist: false,
        }))
      );

      setNumberOfAnnotationsWithOutImages(annotationsWithNoImages);
      setRows(newRows);
    };

    if (jsonData && jsonData.annotations && images) buildRows();
  }, [images, jsonData]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle>Image Status</DialogTitle>
      <DialogContent>
        <Box mt={3}>
          {numberOfAnnotationsWithOutImages > 0 && (
            <Alert severity="warning">We have detected a missing image</Alert>
          )}
        </Box>
        <Box minWidth={800}>
          <Scrollbar>
            <TableContainer sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>S.No</TableCell>
                    <TableCell align="left">Image Name</TableCell>
                    <TableCell align="center">Exist on JSON</TableCell>
                    <TableCell align="center">No. of Annotations</TableCell>
                    <TableCell align="right">Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row: any, index: number) => {
                    return (
                      <TableRow key={row.id}>
                        <TableCell component="th" scope="row">
                          {index + 1}
                        </TableCell>
                        <TableCell align="left">{row.name}</TableCell>
                        <TableCell align="left">
                          <Label color={row.exist ? 'success' : 'error'}>
                            {row.exist ? 'Exist' : 'Not Exist'}
                          </Label>
                        </TableCell>
                        <TableCell align="center">
                          {row.annotations.length}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => onDelete(row)} edge="end">
                            <Iconify icon={'bi:x'} color="error" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Box>
      </DialogContent>

      <DialogActions>
        <Box flex={1} justifyContent="space-between" display="flex">
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={() => onApprove(rows)}
            variant="contained"
            disabled={loading}
          >
            Confirm
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ImagesStatus;
