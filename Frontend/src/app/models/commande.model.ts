export interface ArticleInCommande {
  _id: string;
  designation: string;
  quantite: number;
  prix: number;
}

export interface Commande {
  _id?: string;
  client: string;
  dateCommande: Date;
  statut: 'Validée' | 'en cours' | 'annulée';
  montantTotal: number;
  articles: ArticleInCommande[];
}
