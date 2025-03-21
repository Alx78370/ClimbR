export interface Friend {
  id: number;
  username: string;
  status?: "none" | "pending" | "accepted";
}

export interface FriendRequest {
  id: number;
  user_id: number;
  friend_id: number;
  username: string;
}
