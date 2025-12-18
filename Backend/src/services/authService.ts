import * as mongodb from "mongodb";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { getDB } from "../database/index";
import { IUser, USER_COLLECTION } from "../models/userModel";
import { CLIENT_COLLECTION } from "../models/userModel";

export class AuthService {
    private collection() {
        return getDB().collection<IUser>(USER_COLLECTION);
    }

    async register(userData: { email: string; password: string; nom: string; prenom?: string; role: "admin" | "client"; telephone?: string; adresse?: string }) {
        const existingUser = await this.collection().findOne({ email: userData.email });
        if (existingUser) {
            throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const user: IUser = {
            ...userData,
            password: hashedPassword,
            createdAt: new Date()
        };

        const result = await this.collection().insertOne(user);

        let clientId;
        if (userData.role === "client") {
            const clientData = {
                nom: userData.nom,
                prenom: userData.prenom,
                email: userData.email,
                telephone: userData.telephone || "",
                adresse: userData.adresse || "",
                commandes: []
            };
            const clientResult = await getDB().collection(CLIENT_COLLECTION).insertOne(clientData);
            clientId = clientResult.insertedId.toString();
        }

        const token = this.generateToken(
            result.insertedId.toString(), 
            userData.email, 
            userData.role,
            clientId
        );

        return {
            token,
            user: {
                userId: result.insertedId.toString(),
                email: user.email,
                nom: user.nom,
                prenom: user.prenom,
                role: user.role,
                clientId: clientId
            }
        };
    }

    async login(email: string, password: string) {
        const user = await this.collection().findOne({ email });
        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error("Invalid credentials");
        }

        let clientId;
        if (user.role === "client") {
            const client = await getDB().collection(CLIENT_COLLECTION).findOne({ email: user.email });
            if (client) {
                clientId = client._id.toString();
            }
        }

        const token = this.generateToken(user._id!.toString(), user.email, user.role, clientId);

        return {
            token,
            user: {
                userId: user._id!.toString(),
                email: user.email,
                nom: user.nom,
                prenom: user.prenom,
                role: user.role,
                clientId: clientId
            }
        };
    }

    private generateToken(userId: string, email: string, role: string, clientId?: string): string {
        const secret = process.env.JWT_SECRET || "your-secret-key";
        const payload: any = { userId, email, role };
        if (clientId) {
            payload.clientId = clientId;
        }
        return jwt.sign(
            payload,
            secret,
            { expiresIn: "24h" }
        );
    }

    verifyToken(token: string): any {
        try {
            const secret = process.env.JWT_SECRET || "your-secret-key";
            return jwt.verify(token, secret);
        } catch (error) {
            throw new Error("Invalid token");
        }
    }
}
