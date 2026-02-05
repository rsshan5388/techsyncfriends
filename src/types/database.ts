export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  created_at: string;
  approved: boolean;
  is_admin: boolean;
  requested_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  likes?: Like[];
  comments?: Comment[];
}

export interface Like {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  created_at: string;
  profiles?: Profile;
}
