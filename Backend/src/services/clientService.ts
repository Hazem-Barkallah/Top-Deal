import * as mongodb from "mongodb";
import { getDB } from "../database/index";
import { IClient, CLIENT_COLLECTION } from "../models/clientModel";
import { COMMANDE_COLLECTION } from "../models/commandeModel";

export class ClientService {

    private collection() {
        return getDB().collection<IClient>(CLIENT_COLLECTION);
    }

    private commandeCollection() {
        return getDB().collection(COMMANDE_COLLECTION);
    }

    async createClient(data: IClient) {
        const result = await this.collection().insertOne(data);
        return { _id: result.insertedId.toString(), ...data };
    }

    async getClients() {
        return this.collection().find().toArray();
    }

    async getClientById(id: string) {
        return this.collection().findOne({
            _id: new mongodb.ObjectId(id),
        });
    }

    async updateClient(id: string, data: Partial<IClient>) {
        await this.collection().updateOne(
            { _id: new mongodb.ObjectId(id) },
            { $set: data }
        );
        return this.getClientById(id);
    }

    async deleteClient(id: string) {
        const clientId = new mongodb.ObjectId(id);
        
        // Check if client has associated commandes
        const commandesCount = await this.commandeCollection().countDocuments({
            client: clientId
        });

        if (commandesCount > 0) {
            throw new Error("Impossible de supprimer un client ayant des commandes associées");
        }

        return this.collection().deleteOne({ _id: clientId });
    }

    async getClientWithCommandes(clientId: string) {
        const client = await this.collection().findOne({
            _id: new mongodb.ObjectId(clientId)
        });

        if (!client) {
            return null;
        }

        const commandes = await this.commandeCollection().find({
            client: new mongodb.ObjectId(clientId)
        }).toArray();

        return {
            ...client,
            commandes
        };
    }
}