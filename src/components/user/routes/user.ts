import { Router } from 'express';
import { authentication } from '../../../middlewear/auth'; // Fixed path to 'middleware'
import { signUp, logIn, logOut, logOutFromAllDevices } from '../controller/admin.controller';

// Create a new Router instance
const userRouter = Router();

// Define routes
userRouter.post('/login', logIn);
userRouter.post('/signup', signUp);
userRouter.post('/logout', authentication, logOut);
userRouter.post('/logoutall', authentication, logOutFromAllDevices);

// Export the router
export { userRouter };
