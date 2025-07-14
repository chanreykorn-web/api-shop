import express from 'express';
import { getAll, getById, create, update, deleted, upload  } from '../controllers/controllerProduct.js';


const routerProduct = express.Router();


routerProduct.get('/', getAll);
routerProduct.get('/:id', getById);
routerProduct.post('/create', upload.single('image'), create);
routerProduct.put('/update/:id', upload.single('image'), update);
routerProduct.delete('/delete/:id', deleted);


export default routerProduct