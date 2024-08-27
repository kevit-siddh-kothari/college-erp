"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../../../middlewear/auth"); // Fixed path to 'middleware'
const user_controller_1 = require("../controller/user.controller");
const validator = __importStar(require("express-validator"));
// Create a new Router instance
const userRouter = (0, express_1.Router)();
exports.userRouter = userRouter;
// Define routes
userRouter.post('/login', validator.body('username').notEmpty().withMessage(`username is required !`), validator.body('password').notEmpty().withMessage(`password is required !`), user_controller_1.userController.logIn);
userRouter.post('/signup', validator.body('password').isLength({ min: 7 }).withMessage(`password mus be of minimum 7 characters !`), validator.body('username').notEmpty().isEmail().withMessage(`please enter a valid email format !`), validator
    .body('role')
    .custom(a => a === 'admin' || 'staffmember')
    .notEmpty(), user_controller_1.userController.signUp);
userRouter.post('/logout', auth_1.authentication, user_controller_1.userController.logOut);
userRouter.post('/logoutall', auth_1.authentication, user_controller_1.userController.logOutFromAllDevices);
