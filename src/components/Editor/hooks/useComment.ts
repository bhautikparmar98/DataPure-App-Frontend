import Konva from 'konva';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { setComments as setCommentsAction } from 'src/redux/slices/classes/classes.actions';
import { Tool } from 'src/constants';
interface Comment {
  text: string;
  x: number;
  y: number;
}

const useComment = (
  bgLayerRef: React.RefObject<Konva.Layer>,
  currentTool: Tool,
  backgroundWidth: number
) => {
  const storedComments = useAppSelector(({ classes }) => classes.comments);
  const [comments, setComments] = useState<Comment[]>(
    storedComments?.length > 0 ? storedComments : []
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (comments.length > 0) {
      dispatch(setCommentsAction(comments));
    }
    return () => document.querySelector('.editor-comment-popup')?.remove();
  }, [dispatch, comments]);

  useEffect(() => {
    document.querySelector('.editor-comment-popup')?.remove();
  }, [currentTool]);

  const createStyledTextarea = (x: number, y: number, value = '') => {
    document.querySelector('.editor-comment-popup')?.remove();

    const textarea = document.createElement('textarea');
    document.body!.appendChild(textarea);
    textarea.style.position = 'fixed';
    textarea.style.top = '50%';
    textarea.style.left = 'calc(50% - 300px)';
    textarea.style.width = '250px';
    textarea.style.height = '36px';
    textarea.style.resize = 'none';
    textarea.style.borderRadius = '8px';
    textarea.style.outline = 'none';
    textarea.style.padding = '8px 0 0 10px';
    textarea.placeholder = 'Add a comment';
    textarea.value = value;
    textarea.classList.add('editor-comment-popup');
    textarea.focus();
    return textarea;
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
        setComments(newComments);

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
      const bg = layer.children[0]!;
      //to avoid clicking on a previous comment
      if (e.target.attrs?.type === 'Comment') return;

      const { x = 0, y = 0 } = bg!.getStage()!.getRelativePointerPosition();
      console.log(x, y);

      // create textarea and style it
      const textarea = createStyledTextarea(x, y);

      textarea.addEventListener('keydown', function (e) {
        if (e.code === 'Enter' && textarea.value.length > 0) {
          setComments((prev) => [...prev, { text: textarea.value, x, y }]);

          document.body!.removeChild(textarea);
        } else if (
          e.code === 'Escape' || //cancel comment
          (e.code === 'Enter' && textarea.value.length === 0) //empty textarea
        ) {
          document.body!.removeChild(textarea);
        }
      });
    }
  };

  return { handleComment, handleCommentClick, comments };
};
export default useComment;
