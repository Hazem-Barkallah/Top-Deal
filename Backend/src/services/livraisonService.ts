import * as mongodb from "mongodb";
import { getDB } from "../database/index";
import { ILivraison, LIVRAISON_COLLECTION } from "../models/livraisonModel";
import { COMMANDE_COLLECTION } from "../models/commandeModel";
import { PERSONNEL_COLLECTION } from "../models/personnelModel";

export class LivraisonService {
    private collection() {
        return getDB().collection<ILivraison>(LIVRAISON_COLLECTION);
    }

    private commandeCollection() {
        return getDB().collection(COMMANDE_COLLECTION);
    }

    private personnelCollection() {
        return getDB().collection(PERSONNEL_COLLECTION);
    }

    async createLivraison(data: ILivraison) {
        if (!data.commandId) {
            throw new Error("L'ID de la commande est obligatoire");
        }

        if (!data.delivererId) {
            throw new Error("L'ID du livreur est obligatoire");
        }

        const commandExists = await this.commandeCollection().findOne({
            _id: new mongodb.ObjectId(data.commandId),
        });

        if (!commandExists) {
            throw new Error(`La commande avec l'ID ${data.commandId} n'existe pas dans la base de donn�es`);
        }

        const personnel = await this.personnelCollection().findOne({
            _id: new mongodb.ObjectId(data.delivererId),
        });

        if (!personnel) {
            throw new Error(`Le personnel avec l'ID ${data.delivererId} n'existe pas dans la base de donn�es`);
        }

        if (personnel.role !== "livreur") {
            throw new Error(`Le personnel avec l'ID ${data.delivererId} n'a pas le r�le de livreur (r�le actuel: ${personnel.role})`);
        }

        const result = await this.collection().insertOne(data);
        return { _id: result.insertedId.toString(), ...data };
    }

    async getLivraisons() {
        try {
            const livraisons = await this.collection()
                .aggregate([
                    {
                        $addFields: {
                            commandIdObj: { $toObjectId: "$commandId" }
                        }
                    },
                    {
                        $lookup: {
                            from: "commande",
                            localField: "commandIdObj",
                            foreignField: "_id",
                            as: "commande"
                        }
                    },
                    {
                        $unwind: {
                            path: "$commande",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $lookup: {
                            from: "client",
                            localField: "commande.client",
                            foreignField: "_id",
                            as: "client"
                        }
                    },
                    {
                        $unwind: {
                            path: "$client",
                            preserveNullAndEmptyArrays: true
                        }
                    }
                ])
                .toArray();
            
            // Now add the fields
            const enrichedLivraisons = livraisons.map((liv: any) => ({
                ...liv,
                clientName: liv.client && liv.client.nom && liv.client.prenom 
                    ? `${liv.client.nom} ${liv.client.prenom}`
                    : null,
                commandeDate: liv.commande?.dateCommande || null
            }));
            
            if (enrichedLivraisons.length > 0) {
                console.log("=== ENRICHED LIVRAISON (SENT TO FRONTEND) ===");
                console.log("clientName:", enrichedLivraisons[0].clientName);
                console.log("commandeDate:", enrichedLivraisons[0].commandeDate);
            }
            
            return enrichedLivraisons;
        } catch (error) {
            console.error("Error in getLivraisons aggregation:", error);
            throw error;
        }
    }

    async getLivraisonsByClient(clientId: string) {
        try {
            const livraisons = await this.collection()
                .aggregate([
                    {
                        $addFields: {
                            commandIdObj: { $toObjectId: "$commandId" }
                        }
                    },
                    {
                        $lookup: {
                            from: "commande",
                            localField: "commandIdObj",
                            foreignField: "_id",
                            as: "commande"
                        }
                    },
                    {
                        $unwind: {
                            path: "$commande",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $match: {
                            "commande.client": new mongodb.ObjectId(clientId)
                        }
                    },
                    {
                        $lookup: {
                            from: "client",
                            localField: "commande.client",
                            foreignField: "_id",
                            as: "client"
                        }
                    },
                    {
                        $unwind: {
                            path: "$client",
                            preserveNullAndEmptyArrays: true
                        }
                    }
                ])
                .toArray();
            
            // Now add the fields
            const enrichedLivraisons = livraisons.map((liv: any) => ({
                ...liv,
                clientName: liv.client && liv.client.nom && liv.client.prenom 
                    ? `${liv.client.nom} ${liv.client.prenom}`
                    : null,
                commandeDate: liv.commande?.dateCommande || null
            }));
            
            return enrichedLivraisons;
        } catch (error) {
            console.error("Error in getLivraisonsByClient aggregation:", error);
            throw error;
        }
    }

    async getLivraisonById(id: string) {
        return this.collection().findOne({
            _id: new mongodb.ObjectId(id),
        });
    }

    async updateLivraison(id: string, data: Partial<ILivraison>) {
        if (data.commandId) {
            const commandExists = await this.commandeCollection().findOne({
                _id: new mongodb.ObjectId(data.commandId),
            });

            if (!commandExists) {
                throw new Error(`La commande avec l'ID ${data.commandId} n'existe pas dans la base de donn�es`);
            }
        }

        if (data.delivererId) {
            const personnel = await this.personnelCollection().findOne({
                _id: new mongodb.ObjectId(data.delivererId),
            });

            if (!personnel) {
                throw new Error(`Le personnel avec l'ID ${data.delivererId} n'existe pas dans la base de donn�es`);
            }

            if (personnel.role !== "livreur") {
                throw new Error(`Le personnel avec l'ID ${data.delivererId} n'a pas le r�le de livreur (r�le actuel: ${personnel.role})`);
            }
        }

        await this.collection().updateOne(
            { _id: new mongodb.ObjectId(id) },
            { $set: data }
        );
        return this.getLivraisonById(id);
    }

    async deleteLivraison(id: string) {
        return this.collection().deleteOne({
            _id: new mongodb.ObjectId(id),
        });
    }

    async getLivraisonsByStatus(
        status: "en attente" | "en cours" | "livrée" | "annulée"
    ) {
        return this.collection().find({ status }).toArray();
    }
}
