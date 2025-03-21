export interface NotificationPayload {
  receiverId: number;
  type: string;
  message: string;
}

export interface NotificationAwareResponse {
  message: string;
  notify?: NotificationPayload | null;
}
