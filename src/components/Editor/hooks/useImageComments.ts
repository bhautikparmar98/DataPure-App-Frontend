import { useEffect, useState } from 'react';
import { ROLES } from 'src/constants';
import useAuth from 'src/hooks/useAuth';
import { setComments } from 'src/redux/slices/classes/classes.slice';
import { useDispatch } from 'react-redux';
import axiosInstance from 'src/utils/axios';

const useImageComments = ({ isAnnotatorRedo, imageId }: { isAnnotatorRedo?: boolean; imageId: string }) => {
  const { role } = useAuth();
  const dispatch = useDispatch();

  const canSeeComments = () => {
    if ((role === ROLES.ANNOTATOR.value && isAnnotatorRedo) || role === ROLES.QA.value) return true;
    return false;
  };

  const canAddComments = () => {
    if (role === ROLES.QA.value || role === ROLES.CLIENT.value) return true;
    return false;
  };

  const canDeleteComment = () => {
    // TODO: handle delete
    return false;
  };

  useEffect(() => {
    const getAllComments = async () => {
      const response = await axiosInstance.get(`/image/${imageId}/comment`);
      const { comments } = response.data;

      const newComments = comments?.map(({ x, y, text }: { x: string; y: string; text: string }) => ({
        x,
        y,
        value: text,
      }));
      dispatch(setComments({ newComments }));
    };

    if (canSeeComments() && imageId?.length > 0) {
      getAllComments();
    }
  }, [role, isAnnotatorRedo, imageId]);

  const addComment = async (text: string, x: number, y: number) => {
    if (!canAddComments()) return;
    await axiosInstance.post(`image/${imageId}/comment`, { text, x, y });
  };

  const deleteComment = async (commentId: string) => {
    if (commentId?.length > 0 && canDeleteComment()) await axiosInstance.delete(`comment/${commentId}`);
  };

  return { addComment, deleteComment };
};

export default useImageComments;
