import { Request, Response } from "express";
import { AuthService } from "../services/authService";

const authService = new AuthService();

export class AuthController {
    async register(req: Request, res: Response) {
        try {
            const { email, password, nom, prenom, role, telephone, adresse } = req.body;

            if (!email || !password || !nom || !role) {
                return res.status(400).json({ message: "Email, password, nom, and role are required" });
            }

            if (role !== "admin" && role !== "client") {
                return res.status(400).json({ message: "Role must be admin or client" });
            }

            const result = await authService.register({
                email,
                password,
                nom,
                prenom,
                role,
                telephone,
                adresse
            });

            res.status(201).json(result);
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: "Email and password are required" });
            }

            const result = await authService.login(email, password);
            res.json(result);
        } catch (err: any) {
            res.status(401).json({ message: err.message });
        }
    }
}
