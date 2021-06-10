import { Router } from 'express';
import { adminMW } from './middleware';
import { login, logout } from './Auth';
import { getAllAccounts, addOneAccount, updateOneAccount, deleteOneAccount } from '../controllers/AccountController';




// Auth router
const authRouter = Router();
authRouter.post('/login', login);
authRouter.get('/logout', logout);


// Product-router

const productRouter = Router();
productRouter.get('/all', getAllAccounts);
productRouter.post('/add', addOneAccount);
productRouter.put('/update', updateOneAccount);
productRouter.delete('/delete/:id', deleteOneAccount);


// Account-router 
const accountRouter = Router();
accountRouter.get('/all', getAllAccounts);
accountRouter.post('/add', addOneAccount);
accountRouter.put('/update', updateOneAccount);
accountRouter.delete('/delete/:id', deleteOneAccount);


// Export the base-router
const baseRouter = Router();
baseRouter.use('/auth', authRouter);
baseRouter.use('/accounts', accountRouter);
baseRouter.use('/products', productRouter);
export default baseRouter;
