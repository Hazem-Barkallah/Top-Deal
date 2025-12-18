import { Request, Response } from "express";
import { LivraisonService } from "../services/livraisonService";

const livraisonService = new LivraisonService();

export class LivraisonController {
    async create(req: Request, res: Response) {
        try {
            const livraison = await livraisonService.createLivraison(req.body);
            res.status(201).json(livraison);
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }

    async getAll(req: any, res: Response) {
        try {
            const user = req.user;
            let livraisons;
            
            if (user.role === 'client' && user.clientId) {
                livraisons = await livraisonService.getLivraisonsByClient(user.clientId);
            } else {
                livraisons = await livraisonService.getLivraisons();
            }
            
            res.json(livraisons);
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const livraison = await livraisonService.getLivraisonById(req.params.id);
            if (!livraison) return res.status(404).json({ message: "Livraison Inexistante" });
            res.json(livraison);
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const livraison = await livraisonService.updateLivraison(req.params.id, req.body);
            if (!livraison) return res.status(404).json({ message: "Livraison Inexistante" });
            res.json(livraison);
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const result = await livraisonService.deleteLivraison(req.params.id);
            if (result.deletedCount === 0) {
                return res.status(404).json({ message: "Livraison Inexistante" });
            }
            res.json({ message: "Livraison supprimée avec succès" });
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }

    async getByStatus(req: Request, res: Response) {
        try {
            const livraisons = await livraisonService.getLivraisonsByStatus(req.params.status as "en attente" | "en cours" | "livrée" | "annulée");
            res.json(livraisons);
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }

//     async getByCommandId(req: Request, res: Response) {
//         try {
//             const livraisons = await livraisonService.getLivraisonsByCommandId(req.params.commandId);
//             res.json(livraisons);
//         } catch (err: any) {
//             res.status(400).json({ message: err.message });
//         }
//     }
 }

