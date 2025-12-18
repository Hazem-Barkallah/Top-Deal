import { Request, Response } from "express";
import { CommandeService } from "../services/commandeService";

const commandeService = new CommandeService();

export class CommandeController {
    async create(req: Request, res: Response) {
        try {
            const commande = await commandeService.createCommande(req.body);
            res.status(201).json(commande);
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            // Check if user is client and filter accordingly
            const user = (req as any).user;
            if (user && user.role === "client" && user.clientId) {
                const commandes = await commandeService.getCommandesByClientId(user.clientId);
                res.json(commandes);
            } else {
                const commandes = await commandeService.getCommandes();
                res.json(commandes);
            }
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }

    async getById(req: Request, res: Response) {
        const commande = await commandeService.getCommandeById(req.params.id);
        if (!commande)
            return res.status(404).json({ message: "Commande Inexistante" });
        res.json(commande);
    }

    async update(req: Request, res: Response) {
        try {
            const commande = await commandeService.updateCommande(req.params.id, req.body);
            if (!commande)
                return res.status(404).json({ message: "Commande Inexistante" });
            res.json(commande);
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const commande = await commandeService.deleteCommande(req.params.id);
            if (!commande)
                return res.status(404).json({ message: "Commande Inexistante" });
            res.json({ message: "Commande supprimée avec succès" });
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }

    async getByClientId(req: Request, res: Response) {
        try {
            const commandes = await commandeService.getCommandesByClientId(req.params.clientId);
            res.json(commandes);
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }

    async getByLivreurId(req: Request, res: Response) {
        try {
            const commandes = await commandeService.getCommandesByLivreurId(req.params.livreurId);
            res.json(commandes);
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }
}