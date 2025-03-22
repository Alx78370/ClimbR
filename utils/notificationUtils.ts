export function getNotificationTitle(type: string): string {
  const titles: Record<string, string> = {
    friend_request: "Demande d'ami",
    friend_accepted: "Demande d'ami acceptée",
    like: "Nouvelle mention J'aime",
    comment: "Nouveau commentaire",
    new_bloc: "Nouvelle activité",
  };

  return titles[type] || "Notification";
}
