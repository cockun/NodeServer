import { Router } from 'express';
import { adminMW } from './middleware';
import { login, logout } from './Auth';
import { getAllUsers, addOneUser, updateOneUser, deleteOneUser } from './Users';
import { getAllAccounts, addOneAccount, updateOneAccount, deleteOneAccount } from '../controllers/AccountController';




// Auth router
const authRouter = Router();
authRouter.post('/login', login);
authRouter.get('/logout', logout);


// User-router
const userRouter = Router();
userRouter.get('/all', getAllUsers);
userRouter.post('/add', addOneUser);
userRouter.put('/update', updateOneUser);
userRouter.delete('/delete/:id', deleteOneUser);

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
export default baseRouter;
