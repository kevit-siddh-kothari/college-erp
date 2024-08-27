import { Router } from 'express';
import { authentication } from '../../../middlewear/auth'; // Fixed path to 'middleware'
import { signUp, logIn, logOut, logOutFromAllDevices } from '../controller/admin.controller';
import * as validator from 'express-validator';

// Create a new Router instance
const userRouter = Router();

// Define routes
userRouter.post(
  '/login',
  validator.body('username').notEmpty().withMessage(`username is required !`),
  validator.body('password').notEmpty().withMessage(`password is required !`),
  logIn,
);

userRouter.post(
  '/signup',
  validator.body('password').isLength({ min: 7 }).withMessage(`password mus be of minimum 7 characters !`),
  validator.body('username').notEmpty().isEmail().withMessage(`please enter a valid email format !`),
  validator
    .body('role')
    .custom(a => a === 'admin' || 'staffmember')
    .notEmpty(),
  signUp,
);

userRouter.post('/logout', authentication, logOut);

userRouter.post('/logoutall', authentication, logOutFromAllDevices);

// Export the router
export { userRouter };
