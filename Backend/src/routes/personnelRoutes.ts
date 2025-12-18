import { Router } from "express";
import { PersonnelController } from "../controllers/personnelController";

const router = Router();
const controller = new PersonnelController();

router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/:id/commandes", controller.getLivreurWithCommandes);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;