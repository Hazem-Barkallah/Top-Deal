import * as mongodb from "mongodb";
import { getDB } from "../database/index";
import { ICommande, COMMANDE_COLLECTION } from "../models/commandeModel";
import { ARTICLE_COLLECTION } from "../models/articleModel";
import { CLIENT_COLLECTION } from "../models/clientModel";
import { PERSONNEL_COLLECTION } from "../models/personnelModel";

export class CommandeService {
    private collection() {
        return getDB().collection<ICommande>(COMMANDE_COLLECTION);
    }

    private articleCollection() {
        return getDB().collection(ARTICLE_COLLECTION);
    }

    private clientCollection() {
        return getDB().collection(CLIENT_COLLECTION);
    }

    private personnelCollection() {
        return getDB().collection(PERSONNEL_COLLECTION);
    }

    async createCommande(data: ICommande) {
        if (!data.articles || data.articles.length === 0) {
            throw new Error("Une commande doit contenir au moins un article");
        }

        const articlesWithoutId = data.articles.filter(article => !article._id);
        if (articlesWithoutId.length > 0) {
            throw new Error("Tous les articles doivent avoir un ID");
        }

        const articleIds = data.articles.map(article => new mongodb.ObjectId(article._id));

        const existingArticles = await this.articleCollection()
            .find({ _id: { $in: articleIds } })
            .toArray();

        if (existingArticles.length !== articleIds.length) {
            const existingIds = existingArticles.map(a => a._id.toString());
            const missingIds = articleIds
                .filter(id => !existingIds.includes(id.toString()))
                .map(id => id.toString());
            
            throw new Error(
                `Articles introuvables dans la base de données: ${missingIds.join(", ")}`
            );
        }

        // Validate client exists
        const clientId = new mongodb.ObjectId(data.client);
        const client = await this.clientCollection().findOne({ _id: clientId });
        if (!client) {
            throw new Error("Client introuvable");
        }

        // Validate livreur if provided
        if (data.livreurId) {
            const livreurId = new mongodb.ObjectId(data.livreurId);
            const livreur = await this.personnelCollection().findOne({ _id: livreurId });
            if (!livreur) {
                throw new Error("Livreur introuvable");
            }
            if (livreur.role !== "livreur") {
                throw new Error("Le personnel assigné doit avoir le rôle 'livreur'");
            }
        }

        // Ensure client is ObjectId
        const commandeData = {
            ...data,
            client: clientId,
            livreurId: data.livreurId ? new mongodb.ObjectId(data.livreurId) : undefined
        };

        const result = await this.collection().insertOne(commandeData);
        const commandeId = result.insertedId;

        // Update article quantities (reduce stock)
        for (const articleInCommande of data.articles) {
            const article = existingArticles.find(a => a._id.toString() === articleInCommande._id);
            if (article && article.quantite < articleInCommande.quantite) {
                throw new Error(`Stock insuffisant pour ${article.designation}. Disponible: ${article.quantite}`);
            }
            
            await this.articleCollection().updateOne(
                { _id: new mongodb.ObjectId(articleInCommande._id) },
                { $inc: { quantite: -articleInCommande.quantite } }
            );
        }

        // Add commande to client's commandes array
        await this.clientCollection().updateOne(
            { _id: clientId },
            { $push: { commandes: commandeId } } as any
        );

        return { _id: commandeId.toString(), ...commandeData };
    }

    async getCommandes() {
        return this.collection().find().toArray();
    }

    async getCommandeById(id: string) {
        return this.collection().findOne({
            _id: new mongodb.ObjectId(id),
        });
    }

    async updateCommande(id: string, data: Partial<ICommande>) {
        if (data.articles) {
            if (data.articles.length === 0) {
                throw new Error("Une commande doit contenir au moins un article");
            }

            const articlesWithoutId = data.articles.filter(article => !article._id);
            if (articlesWithoutId.length > 0) {
                throw new Error("Tous les articles doivent avoir un ID");
            }

            const articleIds = data.articles.map(article => new mongodb.ObjectId(article._id));

            const existingArticles = await this.articleCollection()
                .find({ _id: { $in: articleIds } })
                .toArray();

            if (existingArticles.length !== articleIds.length) {
                const existingIds = existingArticles.map(a => a._id.toString());
                const missingIds = articleIds
                    .filter(id => !existingIds.includes(id.toString()))
                    .map(id => id.toString());
                
                throw new Error(
                    `Articles introuvables dans la base de données: ${missingIds.join(", ")}`
                );
            }
        }

        const commandeId = new mongodb.ObjectId(id);
        const existingCommande = await this.collection().findOne({ _id: commandeId });
        if (!existingCommande) {
            throw new Error("Commande introuvable");
        }

        // Handle client change
        if (data.client) {
            const newClientId = new mongodb.ObjectId(data.client);
            const newClient = await this.clientCollection().findOne({ _id: newClientId });
            if (!newClient) {
                throw new Error("Client introuvable");
            }

            // If client is changing
            if (!existingCommande.client.equals(newClientId)) {
                // Remove from old client
                await this.clientCollection().updateOne(
                    { _id: existingCommande.client },
                    { $pull: { commandes: commandeId } } as any
                );

                // Add to new client
                await this.clientCollection().updateOne(
                    { _id: newClientId },
                    { $push: { commandes: commandeId } } as any
                );
            }
        }

        // Handle livreur change
        if ('livreurId' in data) {
            if (data.livreurId) {
                const newLivreurId = new mongodb.ObjectId(data.livreurId);
                const newLivreur = await this.personnelCollection().findOne({ _id: newLivreurId });
                if (!newLivreur) {
                    throw new Error("Livreur introuvable");
                }
                if (newLivreur.role !== "livreur") {
                    throw new Error("Le personnel assigné doit avoir le rôle 'livreur'");
                }
            }
        }

        // Handle article quantity changes
        if (data.articles) {
            // Restore stock from old articles
            for (const oldArticle of existingCommande.articles) {
                await this.articleCollection().updateOne(
                    { _id: new mongodb.ObjectId(oldArticle._id) },
                    { $inc: { quantite: oldArticle.quantite } }
                );
            }

            // Check and reduce stock for new articles
            const newArticleIds = data.articles.map(article => new mongodb.ObjectId(article._id));
            const newExistingArticles = await this.articleCollection()
                .find({ _id: { $in: newArticleIds } })
                .toArray();

            for (const newArticleInCommande of data.articles) {
                const article = newExistingArticles.find(a => a._id.toString() === newArticleInCommande._id);
                if (article && article.quantite < newArticleInCommande.quantite) {
                    // Restore all previously restored stock before throwing error
                    for (const oldArticle of existingCommande.articles) {
                        await this.articleCollection().updateOne(
                            { _id: new mongodb.ObjectId(oldArticle._id) },
                            { $inc: { quantite: -oldArticle.quantite } }
                        );
                    }
                    throw new Error(`Stock insuffisant pour ${article.designation}. Disponible: ${article.quantite}`);
                }

                await this.articleCollection().updateOne(
                    { _id: new mongodb.ObjectId(newArticleInCommande._id) },
                    { $inc: { quantite: -newArticleInCommande.quantite } }
                );
            }
        }

        const updateData: any = { ...data };
        if (data.client) {
            updateData.client = new mongodb.ObjectId(data.client);
        }
        if ('livreurId' in data) {
            updateData.livreurId = data.livreurId ? new mongodb.ObjectId(data.livreurId) : undefined;
        }

        await this.collection().updateOne(
            { _id: commandeId },
            { $set: updateData }
        );
        return this.getCommandeById(id);
    }

    async deleteCommande(id: string) {
        const commandeId = new mongodb.ObjectId(id);
        const commande = await this.collection().findOne({ _id: commandeId });
        
        if (!commande) {
            return null;
        }

        // Restore article quantities (add back to stock)
        for (const articleInCommande of commande.articles) {
            await this.articleCollection().updateOne(
                { _id: new mongodb.ObjectId(articleInCommande._id) },
                { $inc: { quantite: articleInCommande.quantite } }
            );
        }

        // Remove from client's commandes array
        await this.clientCollection().updateOne(
            { _id: commande.client },
            { $pull: { commandes: commandeId } } as any
        );

        return this.collection().deleteOne({ _id: commandeId });
    }

    async getCommandesByClientId(clientId: string) {
        return this.collection().find({
            client: new mongodb.ObjectId(clientId)
        }).toArray();
    }

    async getCommandesByLivreurId(livreurId: string) {
        return this.collection().find({
            livreurId: new mongodb.ObjectId(livreurId)
        }).toArray();
    }
}


