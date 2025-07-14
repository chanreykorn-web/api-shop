import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';

import routerUsers from './routes/routeUsers.js';
import routerProduct from './routes/routeProduct.js';
// import { authMiddleware } from './middlewares/auth.js';
import routerAuth from './routes/routeAuth.js';
import routerRole from './routes/routeRole.js';
import routerCategories from './routes/routeCategories.js';
import { authMiddleware } from './middlewares/auth.js';
import { checkPermission } from './middlewares/permissionCheck.js';
import routeIngredient from './routes/routerIngredient.js';
import routerSize from './routes/routerSize.js';

const app = express();
dotenv.config();
app.use(bodyParser.json());

app.use(cors());

// You missed bodyParser! If you're receiving JSON or form data, you should enable it:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/users', authMiddleware, checkPermission('read', 'delete', 'update', 'add'), routerUsers);
app.use('/api/products', authMiddleware, checkPermission('read', 'delete', 'update', 'add'), routerProduct);
app.use('/api/categories', authMiddleware, checkPermission('read', 'delete', 'update', 'add'), routerCategories);
app.use('/api/uploads', express.static('uploads'));
app.use('/api/ingredient', authMiddleware, checkPermission('read', 'delete', 'update', 'add'), routeIngredient);
app.use('/api/size', authMiddleware, checkPermission('read', 'delete', 'update', 'add'), routerSize);
app.use('/api/login', routerAuth);
app.use('/api/role', authMiddleware, routerRole);

const port = process.env.PORT || 3030;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
