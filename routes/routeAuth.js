import express from 'express';
import { loginUser } from '../controllers/controllerAuth.js';

const routerAuth = express.Router();

// Register a new user
routerAuth.post('/', loginUser);


export default routerAuth;