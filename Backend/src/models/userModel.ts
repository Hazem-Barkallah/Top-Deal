import * as mongodb from "mongodb";

export interface IUser {
    _id?: mongodb.ObjectId;
    email: string;
    password: string;
    nom: string;
    prenom?: string;
    role: "admin" | "client";
    telephone?: string;
    adresse?: string;
    createdAt?: Date;
}

export const USER_COLLECTION = "users";
