import express from 'express';
import {
  getAllSizes,
  getSizeById,
  createSize,
  updateSize,
  deleteSize
} from '../controllers/controllerSize.js';

const router = express.Router();

router.get('/', getAllSizes);
router.get('/:id', getSizeById);
router.post('/', createSize);
router.put('/:id', updateSize);
router.delete('/:id', deleteSize);

export default router;