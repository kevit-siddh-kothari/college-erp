"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const auth_middlewear_1 = require("../../../middlewear/auth.middlewear"); // Fixed path to 'middleware'
const user_controller_1 = require("../user.controller");
const handlevalidationerror_middlewear_1 = require("../../../middlewear/handlevalidationerror.middlewear");
const user_validator_1 = require("../validators/user.validator");
// Create a new Router instance
const userRouter = (0, express_1.Router)();
exports.userRouter = userRouter;
// Define routes
userRouter.post('/login', ...user_validator_1.loginValidator, handlevalidationerror_middlewear_1.handleValidationErrors, user_controller_1.userController.logIn);
userRouter.post('/signup', ...user_validator_1.signUpValidator, handlevalidationerror_middlewear_1.handleValidationErrors, user_controller_1.userController.signUp);
userRouter.post('/logout', auth_middlewear_1.authentication, user_controller_1.userController.logOut);
userRouter.post('/logoutall', auth_middlewear_1.authentication, user_controller_1.userController.logOutFromAllDevices);
