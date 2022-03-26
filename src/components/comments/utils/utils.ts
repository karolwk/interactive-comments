import { CommentInterface } from '../types/CommentInterface';

export const setNextId = (commentList: CommentInterface[]): number => {
  // Sets Next ID number, only for localstorage
  let elements = commentList.length;

  commentList.forEach((element) => {
    element.replies &&
      element.replies.length &&
      (elements += element.replies.length);
  });

  return elements + 1;
};

export const findReply = (
  commentList: CommentInterface[],
  id: number
): CommentInterface | null => {
  // Returns refrence to comment with id;
  for (let rootComment of commentList) {
    if (rootComment.id === id) {
      return rootComment;
    }
    if (rootComment.replies?.length) {
      for (let childComment of rootComment.replies) {
        if (childComment.id === id) {
          return childComment;
        }
      }
    }
  }

  return null;
};
