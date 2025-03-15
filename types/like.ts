export interface Like {
  user_id: number;
  username: string;
  profile_picture?: string;
}

export interface LikeResponse {
  likeCount: number;
  userHasLiked: boolean;
  likeList: {
    user_id: number;
    username: string;
    profile_picture?: string;
  }[];
}
