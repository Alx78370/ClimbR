export interface Bloc {
  id: number;
  salle_id: number;
  salle_name: string;
  statut: "en cours" | "complété" | "non complété";
  couleur: string;
  media?: string;
  note?: string;
  created_at: string;
  updated_at: string;
}
