import axios, { AxiosResponse } from 'axios';
import './CommentList.css';
import Comment from './Comment';
import AddComent from './AddComent';
import ReplayWrapper from './ReplayWrapper';
import * as localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';
import React, { useEffect, useState } from 'react';

import jsonbin from '../../api/api';
import { DUMMY_DATA } from './utils/data';

import { CommentInterface, CommentType } from './types/CommentInterface';
import { UserInterface } from './types/AddCommentInterface';
import { setNextId, findReply } from './utils/utils';

const CommentList = () => {
  const [comments, setComments] = useState<CommentInterface[]>([]);
  const [currentUser, setCurrentUser] = useState<UserInterface | null>(null);
  const [replayId, setReplayId] = useState<number | null>(null);

  useEffect(() => {
    const getData = async () => {
      // Fetch local data if fail get from server
      try {
        const commentsLocal = await localforage.getItem<CommentInterface[]>(
          'comments'
        );

        const userLocal = await localforage.getItem<UserInterface>(
          'currentUser'
        );

        if (commentsLocal && userLocal) {
          setComments(commentsLocal);
          setCurrentUser(userLocal);
        } else {
          try {
            await getDataFromJSONBin();
          } catch (error) {
            console.log(error);
            console.log('Using dummy data...');
            saveData(DUMMY_DATA.currentUser, DUMMY_DATA.comments);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    const getDataFromLocalJSONServer = async () => {
      // Fetch data from JSON server
      try {
        const JSON_URL = 'http://localhost:3001';
        const response = await axios.get(JSON_URL + '/comments');
        const userResponse = await axios.get(JSON_URL + '/currentUser');
        saveData(userResponse.data, response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const getDataFromJSONBin = async () => {
      try {
        const response = await jsonbin.get('');

        if (response.status === 200) {
          const data = response.data.record;
          saveData(data.currentUser, data.comments);
        } else {
          throw Error('Error with connection');
        }
      } catch (error) {
        console.error(error);
        throw Error('Error with connection');
      }
    };

    const saveData = (userData: any, commentsData: any): void => {
      setCurrentUser(userData);
      setComments(commentsData);
      localforage.setItem('comments', commentsData);
      localforage.setItem('currentUser', userData);
    };

    getData();
  }, []);

  const onReplay = (
    id: number,
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    // Sets id to render AddComment component
    e.preventDefault();
    setReplayId(id);

    //localforage.clear();
  };

  const onDelete = (id: number) => {
    // Deletes a comment from local state
    const newComments = comments.filter((element) => {
      if (element.replies) {
        element.replies = element.replies.filter((nestedEle) => {
          return nestedEle.id !== id;
        });
      }
      return element.id !== id;
    });
    setComments(newComments);
    localforage.setItem('comments', newComments);
  };

  const onVote = (id: number, vote: 'up' | 'down') => {
    // Adds/remove score to vote

    let reply = findReply(comments, id);

    if (reply) {
      switch (vote) {
        case 'up':
          reply.score++;
          break;
        case 'down':
          reply.score--;
          break;
        default:
          break;
      }
      localforage.setItem('comments', comments);
    }
  };

  const onSendBtnClick = (
    comment: CommentInterface,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    commentType: CommentType,
    parentId?: number
  ) => {
    // Creates new comment on replay and saves it to local storage

    e.preventDefault();
    if (commentType !== CommentType.Update) comment.id = setNextId(comments);

    switch (commentType) {
      case CommentType.Reply:
        if (parentId) {
          comments.forEach((ele) => {
            ele.id === parentId && ele.replies?.push(comment);
          });
          localforage.setItem('comments', comments);
          setReplayId(null);
        }
        break;
      case CommentType.Comment:
        setComments([...comments, comment]); // force to re-render
        localforage.setItem('comments', [...comments, comment]);
        break;
      case CommentType.Update:
        comments.forEach((ele) => {
          if (ele.id === comment.id) {
            ele.content = comment.content;
            return;
          }
          if (ele.replies?.length) {
            ele.replies.forEach((nestedEle) => {
              if (nestedEle.id === comment.id) {
                nestedEle.content = comment.content;
                return;
              }
            });
          }
        });

        localforage.setItem('comments', comments);
        setReplayId(null);

        break;
      default:
        break;
    }
  };

  const renderComments = (list: CommentInterface[]) => {
    const componentsToRender: JSX.Element[] = [];

    list.forEach((element: CommentInterface) => {
      // Logic for replay generation
      const isReplay = replayId && element.id === replayId && currentUser;

      componentsToRender.push(
        <Comment
          key={element.id}
          data={element}
          onReplay={onReplay}
          loggedUser={currentUser}
          onBtnClick={onSendBtnClick}
          onDelete={onDelete}
          onVote={onVote}
        />
      );

      isReplay &&
        componentsToRender.push(
          <AddComent
            parentId={element.id}
            key={uuidv4()}
            userData={currentUser}
            onBtnClick={onSendBtnClick}
            replayingTo={element.user.username}
            commentType={CommentType.Reply}
          />
        );
      if (element.replies && element.replies.length) {
        element.replies.forEach((nestedElement: CommentInterface) => {
          const isReplay =
            replayId && nestedElement.id === replayId && currentUser;

          componentsToRender.push(
            <ReplayWrapper key={uuidv4()}>
              <Comment
                key={nestedElement.id}
                data={nestedElement}
                onReplay={onReplay}
                loggedUser={currentUser}
                onBtnClick={onSendBtnClick}
                onDelete={onDelete}
                onVote={onVote}
              />
            </ReplayWrapper>
          );

          isReplay &&
            componentsToRender.push(
              <ReplayWrapper key={uuidv4()}>
                <AddComent
                  parentId={element.id}
                  key={uuidv4()}
                  userData={currentUser}
                  onBtnClick={onSendBtnClick}
                  replayingTo={nestedElement.user.username}
                  commentType={CommentType.Reply}
                />
              </ReplayWrapper>
            );
        });
      }
    });

    return componentsToRender;
  };

  return (
    <div className="comments">
      {comments.length ? (
        renderComments(comments)
      ) : (
        <>
          Loading... <div className="spin"></div>
        </>
      )}
      {currentUser && (
        <AddComent
          onBtnClick={onSendBtnClick}
          userData={currentUser}
          commentType={CommentType.Comment}
        />
      )}
    </div>
  );
};

export default CommentList;
