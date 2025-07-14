// import express from 'express';
import { getAll, getById, create, update, deleted } from '../controllers/controllerCategories.js';
import express from 'express';

const router = express.Router();

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", deleted);

export default router;