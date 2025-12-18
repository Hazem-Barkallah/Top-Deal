import { Router } from "express";
import { LivraisonController } from "../controllers/livraisonController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();
const controller = new LivraisonController();

router.post("/", authenticate, controller.create);
router.get("/", authenticate, controller.getAll);
router.get("/status/:status", authenticate, controller.getByStatus);
router.get("/:id", authenticate, controller.getById);
router.put("/:id", authenticate, controller.update);
router.delete("/:id", authenticate, controller.delete);

export default router;
