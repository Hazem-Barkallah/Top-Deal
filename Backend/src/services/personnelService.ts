import * as mongodb from "mongodb";
import { getDB } from "../database/index";
import { IPersonnel, PERSONNEL_COLLECTION } from "../models/personnelModel";
import { COMMANDE_COLLECTION } from "../models/commandeModel";

export class PersonnelService {
    private collection() {
        return getDB().collection<IPersonnel>(PERSONNEL_COLLECTION);
    }

    private commandeCollection() {
        return getDB().collection(COMMANDE_COLLECTION);
    }

    async createPersonnel(data: IPersonnel) {
        const result = await this.collection().insertOne(data);
        return { _id: result.insertedId.toString(), ...data };
    }

    async getPersonnels() {
        return this.collection().find().toArray();
    }

    async getPersonnelById(id: string) {
        return this.collection().findOne({
            _id: new mongodb.ObjectId(id),
        });
    }

    async updatePersonnel(id: string, data: Partial<IPersonnel>) {
        await this.collection().updateOne(
            { _id: new mongodb.ObjectId(id) },
            { $set: data }
        );
        return this.getPersonnelById(id);
    }

    async deletePersonnel(id: string) {
        return this.collection().deleteOne({
            _id: new mongodb.ObjectId(id),
        });
    }

    async getLivreurWithCommandes(livreurId: string) {
        const livreur = await this.collection().findOne({
            _id: new mongodb.ObjectId(livreurId)
        });

        if (!livreur) {
            return null;
        }

        if (livreur.role !== "livreur") {
            throw new Error("Le personnel spécifié n'est pas un livreur");
        }

        const commandes = await this.commandeCollection().find({
            livreurId: new mongodb.ObjectId(livreurId)
        }).toArray();

        return {
            ...livreur,
            commandes
        };
    }
}