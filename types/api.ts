export interface ApiResponse {
  message: string;
}

export interface NotificationAwareResponse {
  message: string;
  notify?: {
    receiverId: number;
    type: string;
    message: string;
  } | null;
}
