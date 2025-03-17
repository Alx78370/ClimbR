export interface Like {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  profile_picture?: string;
}

export interface LikeResponse {
  likeCount: number;
  userHasLiked: boolean;
  likePreview: Like[];
  likeList: Like[];
}
