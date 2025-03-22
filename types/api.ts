import type { Bloc } from "./bloc";
export interface NotificationPayload {
  receiverId: number;
  type: string;
  message: string;
}
export interface NotificationAwareResponse {
  message: string;
  notify?: NotificationPayload | null;
}
export interface MultiNotificationAwareResponse {
  success: boolean;
  bloc: Bloc;
  notify?: NotificationPayload[] | null;
}
