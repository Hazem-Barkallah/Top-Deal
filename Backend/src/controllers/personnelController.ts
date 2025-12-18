import { Request, Response } from "express";
import { PersonnelService } from "../services/personnelService";

const personnelService = new PersonnelService();

export class PersonnelController {
    async create(req: Request, res: Response) {
        try {
            const personnel = await personnelService.createPersonnel(req.body);
            res.status(201).json(personnel);
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }

    async getAll(req: Request, res: Response) {
        const personnels = await personnelService.getPersonnels();
        res.json(personnels);
    }

    async getById(req: Request, res: Response) {
        const personnel = await personnelService.getPersonnelById(req.params.id);
        if (!personnel)
            return res.status(404).json({ message: "Personnel Inexistant" });
        res.json(personnel);
    }

    async update(req: Request, res: Response) {
        try {
            const personnel = await personnelService.updatePersonnel(req.params.id, req.body);
            if (!personnel)
                return res.status(404).json({ message: "Personnel Inexistant" });
            res.json(personnel);
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }

    async delete(req: Request, res: Response) {
        const personnel = await personnelService.deletePersonnel(req.params.id);
        if (!personnel)
            return res.status(404).json({ message: "Personnel Inexistant" });
        res.json({ message: "Personnel supprimé avec succès" });
    }

    async getLivreurWithCommandes(req: Request, res: Response) {
        try {
            const livreur = await personnelService.getLivreurWithCommandes(req.params.id);
            if (!livreur)
                return res.status(404).json({ message: "Livreur Inexistant" });
            res.json(livreur);
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }
}