import Konva from 'konva';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setComments as setCommentsAction } from 'src/redux/slices/classes/classes.slice';
import { ROLES, Tool } from 'src/constants';
import useAuth from 'src/hooks/useAuth';
import { RootState } from 'src/redux/store';
import _ from 'lodash';
interface Comment {
  text: string;
  x: number;
  y: number;
}

// !TODO: Handle comment movement in redux store
const useComment = (
  bgLayerRef: React.RefObject<Konva.Layer>,
  currentTool: Tool,
  bgWidthScale: number,
  bgHeightScale: number,
  onAddComment: (text: string, x: number, y: number) => void,
  onDeleteComment: (commentId: string) => void
) => {
  const storedComments = useSelector((state: RootState) => state.classes.comments);
  const { role } = useAuth();
  const [comments, setComments] = useState<Comment[]>(storedComments?.length > 0 ? storedComments : []);

  const dispatch = useDispatch();

  useEffect(() => {
    return () => document.querySelector('.editor-comment-popup')?.remove();
  }, [dispatch]);

  useEffect(() => {
    const updateComments = () => {
      setComments(storedComments);
    };

    updateComments();
  }, [storedComments]);

  useEffect(() => {
    document.querySelector('.editor-comment-popup')?.remove();
  }, [currentTool]);

  const createStyledTextarea = (x: number, y: number, value = '') => {
    document.querySelector('.editor-comment-popup')?.remove();

    const textarea = document.createElement('textarea');
    document.body!.appendChild(textarea);
    textarea.style.position = 'fixed';
    textarea.style.top = `${y + 10}px`;
    textarea.style.left = `${x}px`;
    textarea.style.width = '250px';
    textarea.style.minHeight = '72px';
    textarea.style.resize = 'none';
    textarea.style.borderRadius = '8px';
    textarea.style.outline = 'none';
    textarea.style.padding = '8px 0 0 10px';
    textarea.placeholder = 'Add a comment';
    textarea.value = value;
    textarea.classList.add('editor-comment-popup');
    if (role === ROLES.ANNOTATOR.value) {
      textarea.disabled = true;
      textarea.style.backgroundColor = '#fff';
    }
    textarea.tabIndex = 2;
    textarea.focus();
    return textarea;
  };

  const canAddComments = () => {
    if (role === ROLES.QA.value || role === ROLES.CLIENT.value) return true;
    return false;
  };

  const handleCommentClick = (e: Konva.KonvaEventObject<MouseEvent>, text: string, commendIndex: number) => {
    e.cancelBubble = true;
    const { x = 0, y = 0 } = e.target.getStage()!.getPointerPosition()!;

    const textarea = createStyledTextarea(x, y, text);
    textarea.addEventListener('keydown', function (e) {
      if (e.code === 'Enter' && textarea.value.length > 0) {
        const currentComments = _.cloneDeep(comments);
        currentComments[commendIndex].text = textarea.value;
        const newComments = currentComments.map((comment, i) => {
          if (i === commendIndex) comment.text = textarea.value;
          return comment;
        });

        dispatch(setCommentsAction({ newComments }));

        document.body!.removeChild(textarea);
      } else if (
        e.code === 'Escape' || //cancel comment
        (e.code === 'Enter' && textarea.value.length === 0) //empty textarea
      ) {
        document.body!.removeChild(textarea);
      }
    });
  };

  const handleComment = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const layer = bgLayerRef.current;

    if (layer && layer?.children?.length !== 0) {
      const bg = (layer as any).children[0]!;
      //to avoid clicking on a previous comment
      if (e.target?.attrs?.type === 'Comment') return;

      const { x = 0, y = 0 } = bg!.getStage()!.getRelativePointerPosition();
      const { x: bgX = 0, y: bgY = 0 } = bg?.attrs;

      const absoluteX = (x - bgX) / bgWidthScale;
      const absoluteY = (y - bgY) / bgHeightScale;

      const { x: stageX = 0, y: stageY = 0 } = e.target?.getStage()!.getPointerPosition()!;

      // create textarea and style it
      if (canAddComments()) {
        const textarea = createStyledTextarea(stageX, stageY);

        textarea.addEventListener('keydown', function (e) {
          if (e.code === 'Enter' && textarea.value.length > 0) {
            const newComments = [...comments, { text: textarea.value, x: absoluteX, y: absoluteY }];

            onAddComment(textarea.value, (x - bgX) / bgWidthScale, (y - bgY) / bgHeightScale);
            dispatch(setCommentsAction({ newComments }));

            document.body!.removeChild(textarea);
          } else if (
            e.code === 'Escape' || //cancel comment
            (e.code === 'Enter' && textarea.value.length === 0) //empty textarea
          ) {
            document.body!.removeChild(textarea);
          }
        });
      }
    }
  };

  return { handleComment, handleCommentClick, comments };
};
export default useComment;
