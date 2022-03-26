import { useRef, useState, useEffect } from 'react';
import { CommentInterface, CommentType } from './types/CommentInterface';
import AddComent from './AddComent';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import { UserInterface } from './types/AddCommentInterface';
import { onSendBtnClick } from '../../types';
import Modal from './Modal';

interface CommentProps {
  data: CommentInterface;
  loggedUser: UserInterface | null;
  onReplay: (
    id: number,
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => void;
  onBtnClick: onSendBtnClick;
  onDelete(id: number): void;
  onVote(id: number, vote: 'up' | 'down'): void;
}

TimeAgo.addDefaultLocale(en);

const Comment: React.FC<CommentProps> = ({
  data,
  onReplay,
  onBtnClick,
  loggedUser,
  onDelete,
  onVote,
}) => {
  const commentRef = useRef<HTMLDivElement | null>(null);
  // Toggle edit component
  const [edit, setEdit] = useState(false);
  /// Toggle modal
  const [modal, setModal] = useState(false);
  // Check if logged
  const isLogged = loggedUser && loggedUser.username === data.user.username;
  // Check if voted
  const [votedUp, setVotedUp] = useState(false);
  const [votedDown, setVotedDown] = useState(false);

  useEffect(() => {
    // Closing editing window if user clicks outside of it

    const listner = (event: MouseEvent) => {
      if (
        commentRef.current &&
        event.target &&
        commentRef.current.contains(event.target as Node)
      ) {
        return;
      }
      setEdit(false);
    };
    document.addEventListener('click', listner, { capture: true });
    return () => {
      document.removeEventListener('click', listner, { capture: true });
    };
  }, []);

  const setDate = (date: string): string => {
    // Sets label for date in nice text format
    const timeAgo = new TimeAgo('en-US');
    if (date.match(/[A-z]/g)) {
      return date;
    } else {
      return timeAgo.format(parseInt(date)) as string;
    }
  };

  const onDeleteBtnClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    // Logic for delete button

    e.preventDefault();
    setModal(true);

    setEdit(false);
  };

  const setReplay = (): JSX.Element => {
    // Sets edit and delete buttons for logged user
    if (isLogged) {
      return (
        <>
          <a
            href="/delete"
            style={{ color: 'red' }}
            onClick={(e) => onDeleteBtnClick(e)}
            className="delete-link"
          >
            <img alt="" srcSet="./images/icon-delete.svg" /> Delete
          </a>

          <a
            href="/edit"
            className="reply-link"
            onClick={(e) => {
              e.preventDefault();
              setEdit(true);
            }}
          >
            <img alt="" srcSet="./images/icon-edit.svg" /> Edit
          </a>
        </>
      );
    }
    return (
      <a
        href="/replay"
        className="reply-link"
        onClick={(e) => onReplay(data.id, e)}
      >
        <img alt="reply icon" srcSet="./images/icon-reply.svg" /> Reply
      </a>
    );
  };

  const closeEditWindow = () => {
    // Closes edit window
    setEdit(false);
  };

  const closeModal = () => {
    // Closes modal
    setModal(false);
  };
  const commentEdit = (): JSX.Element => {
    // Render component to eddit or normal data from comment
    if (isLogged && edit) {
      return (
        <AddComent
          userData={loggedUser}
          closeEdit={closeEditWindow}
          onBtnClick={onBtnClick}
          replayingTo={data.replyingTo}
          content={data.content}
          commentType={CommentType.Update}
          updateId={data.id}
        />
      );
    }

    return (
      <>
        {data.replyingTo && <a href="/">@{data.replyingTo} </a>}
        {data.content}
      </>
    );
  };

  return (
    <div ref={commentRef} className="comment">
      {modal && (
        <Modal onCancel={closeModal} onDelete={() => onDelete(data.id)} />
      )}
      <div className="user-info">
        <img
          alt="avatar"
          src={data.user.image.png}
          srcSet={data.user.image.webp}
        />
        <a href="/">{data.user.username} </a>
        {isLogged && <span className="logged-user">you </span>}
        {setDate(data.createdAt)}
      </div>
      <div className="vote">
        <button
          className="vote-up"
          onClick={() => {
            if (!votedUp && loggedUser) {
              onVote(data.id, 'up');
              setVotedUp(true);
              votedDown && onVote(data.id, 'up');
              setVotedDown(false);
            }
          }}
        >
          <img
            alt="vote up"
            className={votedUp ? 'voted' : ''}
            src="./images/icon-plus.svg"
          ></img>
        </button>

        <div className="counter">{data.score}</div>
        <button
          className="vote-down"
          onClick={() => {
            if (!votedDown && loggedUser) {
              onVote(data.id, 'down');
              setVotedDown(true);
              votedUp && onVote(data.id, 'down');
              setVotedUp(false);
            }
          }}
        >
          <img
            alt="vote down"
            className={votedDown ? 'voted' : ''}
            src="./images/icon-minus.svg"
          ></img>
        </button>
      </div>

      <div className="content">{commentEdit()}</div>
      <div className="replay-edit">{setReplay()}</div>
    </div>
  );
};

export default Comment;
