import * as mongodb from "mongodb";

export interface IPersonnel extends Document {
    nom: string;
    prenom: string;
    email?: string;
    telephone?: string;
    role: "administrateur" | "livreur" | "employé";
    _id?: mongodb.ObjectId;
}

export const PERSONNEL_COLLECTION = "personnel";