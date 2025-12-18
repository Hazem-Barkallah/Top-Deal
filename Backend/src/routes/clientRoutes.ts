import { Router } from "express";
import { ClientController } from "../controllers/clientController";


export const router = Router();
const controller = new ClientController();
router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/:id/commandes", controller.getWithCommandes);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;