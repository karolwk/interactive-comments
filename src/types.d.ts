declare module '*.svg' {
  import { ReactElement, SVGProps } from 'react';
  const content: (props: SVGProps<SVGElement>) => ReactElement;
  export default content;
}

export type onSendBtnClick = (
  comment: CommentInterface,
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  commentType: CommentType,
  parentId?: number
) => void;
