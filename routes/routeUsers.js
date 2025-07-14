import express from 'express';
import { createUser, getAllUsers, getUserById , updateUser , deleteUser} from '../controllers/controllerUsers.js';

const routerUsers = express.Router();

// Register a new user
routerUsers.get('/', getAllUsers);
routerUsers.post('/register', createUser);
routerUsers.get('/:id', getUserById);
routerUsers.put('/:id', updateUser);
routerUsers.delete('/delete/:id', deleteUser);

export default routerUsers;