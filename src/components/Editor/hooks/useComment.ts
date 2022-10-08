import Konva from 'konva';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setComments as setCommentsAction } from 'src/redux/slices/classes/classes.slice';
import { ROLES, Tool } from 'src/constants';
import useAuth from 'src/hooks/useAuth';
import { RootState } from 'src/redux/store';
interface Comment {
  text: string;
  x: number;
  y: number;
}

const useComment = (
  bgLayerRef: React.RefObject<Konva.Layer>,
  currentTool: Tool,
  backgroundWidth: number,
  onAddComment: (text: string, x: number, y: number) => void,
  onDeleteComment: (commentId: string) => void
) => {
  const storedComments = useSelector<RootState>(
    ({ classes }) => classes.comments
  );
  const { role } = useAuth();
  const [comments, setComments] = useState<Comment[]>(
    storedComments?.length > 0 ? storedComments : []
  );

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
    textarea.style.top = `${y + 40}px`;
    textarea.style.left = `${x + 50}px`;
    textarea.style.width = '250px';
    textarea.style.minHeight = '36px';
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
    textarea.focus();
    return textarea;
  };

  const canAddComments = () => {
    if (role === ROLES.QA.value || role === ROLES.CLIENT.value) return true;
    return false;
  };

  const handleCommentClick = (
    e: Konva.KonvaEventObject<MouseEvent>,
    text: string,
    commendIndex: number
  ) => {
    e.cancelBubble = true;
    const { x = 0, y = 0 } = e.target.getStage()!.getRelativePointerPosition()!;

    const textarea = createStyledTextarea(x, y, text);

    textarea.addEventListener('keydown', function (e) {
      if (e.code === 'Enter' && textarea.value.length > 0) {
        comments[commendIndex].text = textarea.value;
        const newComments = comments.map((comment, i) => {
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
      if (e.target.attrs?.type === 'Comment') return;

      const { x = 0, y = 0 } = bg!.getStage()!.getRelativePointerPosition();

      // create textarea and style it
      if (canAddComments()) {
        const textarea = createStyledTextarea(x, y);

        textarea.addEventListener('keydown', function (e) {
          if (e.code === 'Enter' && textarea.value.length > 0) {
            try {
            } catch (error) {}
            const newComments = [...comments, { text: textarea.value, x, y }];

            onAddComment(textarea.value, x, y);
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
