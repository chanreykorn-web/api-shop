import express from 'express';
import multer from 'multer';
import path from 'path';

import { create, getAll, getById, update, remove } from '../controllers/controllerIngredient.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.post('/', upload.single('image'), create);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', upload.single('image'), update);
router.delete('/:id', remove);

export default router;
