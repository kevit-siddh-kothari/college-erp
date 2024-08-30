import { Router } from 'express';
import { authentication } from '../../middlewear/auth.middlewear'; // Fixed path to 'middleware'
import { userController } from './user.controller';
import { handleValidationErrors } from '../../middlewear/handlevalidationerror';
import { loginValidator, signUpValidator } from './user.validator';

// Create a new Router instance
const userRouter = Router();

// Define routes
userRouter.post('/login', ...loginValidator, handleValidationErrors, userController.logIn);

userRouter.post('/signup', ...signUpValidator, handleValidationErrors, userController.signUp);

userRouter.post('/logout', authentication, userController.logOut);

userRouter.post('/logoutall', authentication, userController.logOutFromAllDevices);

// Export the router
export { userRouter };
