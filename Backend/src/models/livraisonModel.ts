import * as mongodb from "mongodb";

export interface ILivraison extends Document {
    commandId: mongodb.ObjectId;
    deliveryDate: Date;
    deliveryPerson: string;
    paymentMode: string;
    status: "en attente" | "en cours" | "livrée" | "annulée";
    _id?: mongodb.ObjectId;
    delivererId: mongodb.ObjectId;
}

export const LIVRAISON_COLLECTION = "livraison";