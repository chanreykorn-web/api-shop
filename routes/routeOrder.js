import express from 'express';
import { createOrder, getAllOrders, deleteOrder } from '../controllers/controllerOrder.js';


const routeOrder = express.Router();

routeOrder.post('/', createOrder);
routeOrder.get('/', getAllOrders);
routeOrder.delete('/:id', deleteOrder);

export default routeOrder;
