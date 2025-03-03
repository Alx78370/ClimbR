export interface Bloc {
  id: number;
  salle_id: number;
  salle_name: string;
  essai: "Flash" | "2-5" | "6-9" | "10+";
  type:
    | "dalle"
    | "vertical"
    | "leger_devers"
    | "gros_devers"
    | "toit"
    | "diedre"
    | "arete";
  couleur: string;
  media?: string;
  titre: string;
  description?: string;
  date_validation: string;
  created_at: string;
  updated_at: string;
  user_id: number;
}
