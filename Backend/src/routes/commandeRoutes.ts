import { Router } from "express";
import { CommandeController } from "../controllers/commandeController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();
const controller = new CommandeController();

router.post("/", authenticate, controller.create);
router.get("/", authenticate, controller.getAll);
router.get("/client/:clientId", authenticate, controller.getByClientId);
router.get("/livreur/:livreurId", authenticate, controller.getByLivreurId);
router.get("/:id", authenticate, controller.getById);
router.put("/:id", authenticate, controller.update);
router.delete("/:id", authenticate, controller.delete);

export default router;
