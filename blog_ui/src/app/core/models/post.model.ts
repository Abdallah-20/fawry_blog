// models/post.model.ts
export interface Post {
  id: string;
  title: string;
  authorName: string;
  content: string;
  likeCount: number;
  dislikeCount: number;
  commentsCount: number;
  createdAt: string;
}