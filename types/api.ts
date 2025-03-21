export interface ApiResponse {
  message: string;
}

export interface CommentPostResponse {
  message: string;
  notify?: {
    receiverId: number;
    type: string;
    message: string;
  } | null;
}
