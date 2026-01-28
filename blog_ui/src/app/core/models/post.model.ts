// models/post.model.ts
export interface Post {
  id: string;
  title: string;
  authorName: string;
  content: string;
  isLiked: boolean | null;
  likeCount: number;
  dislikeCount: number;
  commentsCount: number;
  createdAt: string;
  reactions: Reaction[]
}

export interface Reaction {
  isLike: boolean;
  userName: string;
}