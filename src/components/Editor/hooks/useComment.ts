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

    const div = document.createElement('div')
    div.style.position = 'fixed'
    div.style.top = `${y + 6}px`
    div.style.left = `${x-53}px`;
    div.style.backgroundColor = 'white'
    div.style.borderRadius = '50px 50px 0px 50px'
    div.style.width = '47px'
    div.style.height = '47px'
    
    const circle = document.createElement('span')
    circle.style.position = 'fixed'
    circle.style.top = `${y + 13}px`
    circle.style.left = `${x-47}px`;
    circle.style.backgroundColor = '#ff3030'
    circle.style.borderRadius = '100%'
    circle.style.color = "white"
    circle.style.width = '35px'
    circle.style.height = '35px'
    circle.style.textAlign = 'center'
    circle.style.paddingTop = '5px'
    circle.innerHTML = "#1"


    div.appendChild(circle)

    const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const iconPath = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path'
    );
    iconSvg.setAttribute('width','1.5em' );
    iconSvg.setAttribute('height','1.5em' );
    iconSvg.setAttribute('preserveAspectRatio','xMidYMid meet' );
    iconSvg.setAttribute('viewBox', '0 0 16 16');
    iconPath.setAttribute('fill', 'none');
    iconPath.setAttribute('stroke', 'white');
    iconPath.setAttribute(
      'd',
      'm1.75 9.75l2.5 2.5m3.5-4l2.5-2.5m-4.5 4l2.5 2.5l6-6.5'
    );
    iconPath.setAttribute('stroke-linecap', 'round');
    iconPath.setAttribute('stroke-linejoin', 'round');
    iconPath.setAttribute('stroke-width', '1.5');
    iconSvg.appendChild(iconPath);
    iconSvg.style.position = 'fixed'
    iconSvg.style.top = `${y + 17}px`
    iconSvg.style.left = `${x+210}px`;
    iconSvg.style.backgroundColor = '#ff3030'
    iconSvg.style.borderRadius = '100%'

    const textarea = document.createElement('textarea');
   
    textarea.style.position = 'fixed';
    textarea.style.top = `${y + 10}px`;
    textarea.style.left = `${x}px`;
    textarea.style.width = '250px';
    textarea.style.minHeight = '32px';
    textarea.style.resize = 'none';
    textarea.style.borderRadius = '8px';
    textarea.style.outline = 'none';
    textarea.style.padding = '8px 0 0 10px';
    textarea.placeholder = 'Add a comment';
    textarea.value = value;
    //textarea.classList.add('editor-comment-popup');
    //textarea.appendChild(iconSvg)
    if (role === ROLES.ANNOTATOR.value) {
      textarea.disabled = true;
      textarea.style.backgroundColor = '#fff';
    }
    textarea.tabIndex = 2;
    textarea.focus();
    const customTextBox = document.createElement('div')
    customTextBox.appendChild(textarea)
    customTextBox.appendChild(iconSvg)
    customTextBox.appendChild(div)
    document.body!.appendChild(customTextBox);
    customTextBox.classList.add('editor-comment-popup')
    // console.log(customTextBox.childNodes[0], textarea)
    return customTextBox.childNodes[0]
  };

  const canAddComments = () => {
    if (role === ROLES.QA.value || role === ROLES.CLIENT.value) return true;
    return false;
  };

  const handleCommentClick = (e: Konva.KonvaEventObject<MouseEvent>, text: string, commendIndex: number) => {
    e.cancelBubble = true;
    const { x = 0, y = 0 } = e.target.getStage()!.getPointerPosition()!;

    const textarea = createStyledTextarea(x, y, text) as HTMLTextAreaElement;
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
        const textarea = createStyledTextarea(stageX, stageY) as HTMLTextAreaElement;

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
