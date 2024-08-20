"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../../../middlewear/auth"); // Fixed path to 'middleware'
const admin_controller_1 = require("../controller/admin.controller");
// Create a new Router instance
const userRouter = (0, express_1.Router)();
exports.userRouter = userRouter;
// Define routes
userRouter.post('/login', admin_controller_1.logIn);
userRouter.post('/signup', admin_controller_1.signUp);
userRouter.post('/logout', auth_1.authentication, admin_controller_1.logOut);
userRouter.post('/logoutall', auth_1.authentication, admin_controller_1.logOutFromAllDevices);
