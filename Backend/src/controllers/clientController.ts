import { Request, Response } from "express";
import { ClientService } from "../services/clientService";

const clientService = new ClientService();

export class ClientController {
    async create(req: Request, res: Response) {
        try {
            const client = await clientService.createClient(req.body);
            res.status(201).json(client);
        } catch (err: any) {
            res.statuss(400).json({ message: err.message });
        }
    }

    async getAll(req: Request, res: Response) {
        const clients = await clientService.getClients();
        res.json(clients);
    }

    async getById(req: Request, res: Response) {
        const client = await clientService.getClientById(req.params.id);
        if (!client) return res.status(404).json({ message: "Client Inexistant" });
        res.json(client);
    }

    async update(req: Request, res: Response) {
        try {
            const client = await clientService.updateClient(req.params.id, req.body);
            if (!client) return res.status(404).json({ message: "Client Inexistant" });
            res.json(client);
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const client = await clientService.deleteClient(req.params.id);
            if (!client) return res.status(404).json({ message: "Client Inexistant" });
            res.json({ message: "Client supprimé avec succès" });
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }

    async getWithCommandes(req: Request, res: Response) {
        try {
            const client = await clientService.getClientWithCommandes(req.params.id);
            if (!client) return res.status(404).json({ message: "Client Inexistant" });
            res.json(client);
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }
}
