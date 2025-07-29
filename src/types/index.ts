export interface User {
  id: string;
  code: string;
  createdAt: Date;
}

export interface Post {
  id: string;
  content: string;
  authorCode: string;
  createdAt: Date;
  likes: number;
  likedBy: string[];
  reportCount: number;
  reportedBy: string[];
  replies: Reply[];
}

export interface Reply {
  id: string;
  postId: string;
  content: string;
  authorCode: string;
  createdAt: Date;
  likes: number;
  likedBy: string[];
}

export interface Report {
  id: string;
  postId: string;
  reportedBy: string;
  reason: string;
  createdAt: Date;
}