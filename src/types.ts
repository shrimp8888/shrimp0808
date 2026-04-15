export interface UserProfile {
  name: string;
  handle: string;
  subtitle: string;
  bio: string;
  avatar: string;
}

export interface Reply {
  id: number;
  author: string;
  content: string;
  timestamp: string;
}

export interface Post {
  id: number;
  author: string;
  handle: string;
  avatar: string;
  content: string;
  timestamp: string;
  replies: Reply[];
  reactions?: Record<string, number>;
  image?: string;
}
