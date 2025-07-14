import express from 'express';
import { getCurrentUser,getAllRoles, getRoleById, createRole, updateRole, deleteRole} from '../controllers/controllerRole.js';

const routerRole = express.Router();

routerRole.get('/me', getCurrentUser);
routerRole.get('/', getAllRoles);
routerRole.get('/:id', getRoleById);
routerRole.post('/', createRole);
routerRole.put('/:id', updateRole);
routerRole.delete('/:id', deleteRole);

export default routerRole