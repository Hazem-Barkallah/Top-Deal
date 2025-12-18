import * as mongodb from "mongodb";

export interface IClient extends Document {
    _id?:  mongodb.ObjectId;
    nom: string;
    email: string;
    telephone?: string;
    adresse?: string;
    commandes?: mongodb.ObjectId[];
}

export const CLIENT_COLLECTION = "client";