export type Notification = {
  id: number;
  user_id: number;
  sender_id: number;
  type: "friend_request" | "message" | "like" | "comment" | "other";
  message: string;
  is_read: boolean;
  created_at: string;
  sender_username?: string;
  first_name?: string;
  last_name?: string;
  profile_picture?: string;
};
