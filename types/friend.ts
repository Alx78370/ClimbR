export interface Friend {
  id: number;
  username: string;
  status?: "none" | "pending" | "accepted";
}

export interface FriendRequest {
  id: number;
  username: string;
}

export interface ApiResponse {
  message: string;
}
