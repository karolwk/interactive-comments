import { useState, useRef, useEffect } from 'react';
import { onSendBtnClick } from '../../types';
import { UserInterface } from './types/AddCommentInterface';
import { CommentInterface, CommentType } from './types/CommentInterface';

interface AddCommentProps {
  parentId?: number;
  userData: UserInterface;
  replayingTo?: string | null;
  content?: string;
  commentType: CommentType;
  updateId?: number;
  closeEdit?(): void;
  onBtnClick: onSendBtnClick;
}

const AddComent: React.FC<AddCommentProps> = ({
  userData,
  replayingTo,
  parentId,
  content,
  commentType,
  closeEdit,
  onBtnClick,
  updateId,
}) => {
  const [textValue, setTextValue] = useState('');

  const textArea = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (replayingTo) {
      if (textArea.current) {
        textArea.current.value = `@${replayingTo}, `;
        if (content) {
          textArea.current.value = content;
        }
        setTextValue(textArea.current.value);
        textArea.current?.focus();
      }
    }
    if (content && textArea.current) {
      textArea.current.value = content;
      setTextValue(textArea.current.value);
    }
  }, [replayingTo, content]);

  const createComment = (reply: CommentType): CommentInterface => {
    // Creates new comment or reply or update

    const baseComment: CommentInterface = {
      id: 0,
      content: textValue.replace(`@${replayingTo},`, '').trim(),
      createdAt: new Date().getTime().toString(),
      score: 0,
      user: userData,
    };

    switch (reply) {
      case CommentType.Reply:
        baseComment.replyingTo = replayingTo;
        return baseComment;
      case CommentType.Comment:
        baseComment.replies = [];
        return baseComment;
      case CommentType.Update:
        baseComment.id = updateId as number;

        return baseComment;

      default:
        throw new Error('Error in creating comment, chceck parameters!');
    }
  };

  return (
    <div className="add-comment">
      <form>
        <textarea
          ref={textArea}
          className="txtarea"
          name="textarea"
          rows={4}
          placeholder="Add a comment."
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
        ></textarea>

        {commentType !== CommentType.Update && (
          <img
            alt="avatar"
            src={userData.image.png}
            srcSet={userData.image.webp}
            className="avatar"
          />
        )}
        <button
          className="submit-btn"
          onClick={(e) => {
            onBtnClick(createComment(commentType), e, commentType, parentId);
            setTextValue('');
            closeEdit && closeEdit();
          }}
        >
          {commentType}
        </button>
      </form>
    </div>
  );
};

export default AddComent;
