import * as mongodb from "mongodb";

export interface IArticleInCommande {
    _id: mongodb.ObjectId;
    designation: string;
    quantite: number;
    prix: number;
}

export interface ICommande extends Document {
    client: mongodb.ObjectId;
    livreurId?: mongodb.ObjectId;
    dateCommande: Date;
    statut: "Validée" | "en cours" | "annulée";
    montantTotal: number;
    articles: Array<IArticleInCommande>;
    _id?: mongodb.ObjectId;
}

export const COMMANDE_COLLECTION = "commande";