import { Router } from 'express';
import { authentication } from '../../../middlewear/auth'; // Fixed path to 'middleware'
import { userController } from '../controller/user.controller';
import * as validator from 'express-validator';

// Create a new Router instance
const userRouter = Router();

// Define routes
userRouter.post(
  '/login',
  validator.body('username').notEmpty().withMessage(`username is required !`),
  validator.body('password').notEmpty().withMessage(`password is required !`),
  userController.logIn,
);

userRouter.post(
  '/signup',
  validator.body('password').isLength({ min: 7 }).withMessage(`password mus be of minimum 7 characters !`),
  validator.body('username').notEmpty().isEmail().withMessage(`please enter a valid email format !`),
  validator
    .body('role')
    .custom(a => a === 'admin' || 'staffmember')
    .notEmpty(),
  userController.signUp,
);

userRouter.post('/logout', authentication, userController.logOut);

userRouter.post('/logoutall', authentication, userController.logOutFromAllDevices);

// Export the router
export { userRouter };
