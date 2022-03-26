export interface CommentInterface {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  user: {
    image: {
      png: string;
      webp: string;
    };
    username: string;
  };
  replyingTo?: string | null;
  replies?: CommentInterface[];
}

export enum CommentType {
  Reply = 'REPLY',
  Comment = 'SEND',
  Update = 'UPDATE',
}
