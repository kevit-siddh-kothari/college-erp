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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_module_1 = require("./user.module");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt = __importStar(require("./jwt.token"));
/**
 * UserController class to handle user sign-up, log-in, log-out, and log-out from all devices operations.
 */
class UserController {
    /**
     * Handles user sign-up requests by creating a new user and saving it to the database.
     *
     * @param {Request} req - Express request object containing the user data in the body.
     * @param {Response} res - Express response object used to send the response.
     * @returns {Promise<any>} - Resolves when the sign-up process is complete.
     * @throws {Error} Will throw an error if user data is missing or if saving the user fails.
     */
    async signUp(req, res) {
        try {
            const { username, password, role } = req.body;
            const user = new user_module_1.User({ username, password, role });
            await user.save();
            res.status(201).send('User created successfully');
        }
        catch (error) {
            console.error(`Error during sign-up: ${error.message}`);
            res.status(500).send(error.message);
        }
    }
    /**
     * Handles user log-in requests by verifying credentials and generating a JWT token.
     *
     * @param {Request} req - Express request object containing the user credentials in the body.
     * @param {Response} res - Express response object used to send the response.
     * @returns {Promise<any>} - Resolves when the log-in process is complete.
     * @throws {Error} Will throw an error if the username is invalid or credentials are incorrect.
     */
    async logIn(req, res) {
        try {
            const { username, password } = req.body;
            const user = await user_module_1.User.findOne({ username });
            if (!user) {
                return res.status(404).json({ error: 'user not found' });
            }
            const match = bcrypt_1.default.compareSync(password, user.password);
            if (match) {
                const token = await jwt.generateToken(user);
                res.send({ user, token });
            }
            else {
                return res.status(401).json({ error: 'Password is incorrect' });
            }
        }
        catch (error) {
            console.error(`Error during log-in: ${error.message}`);
            res.status(500).send(error.message);
        }
    }
    /**
     * Handles user log-out requests by removing the current token from the user's token list.
     *
     * @param {AuthenticatedRequest} req - Authenticated request object containing user and token information.
     * @param {Response} res - Express response object used to send the response.
     * @param {NextFunction} next - Express next middleware function.
     * @returns {Promise<any>} - Resolves when the log-out process is complete.
     */
    async logOut(req, res, next) {
        try {
            if (!req.user || !req.token) {
                return res.status(400).send('User or token not found');
            }
            if (req.user && req.token) {
                req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
                await req.user.save();
                res.send('Logged out successfully');
            }
            else {
                return res.status(404).json({ error: 'user token not found' });
            }
        }
        catch (error) {
            res.status(500).send(`Error during log-out: ${error.message}`);
        }
    }
    /**
     * Handles user log-out requests from all devices by clearing the user's token list.
     *
     * @param {AuthenticatedRequest} req - Authenticated request object containing user information.
     * @param {Response} res - Express response object used to send the response.
     * @param {NextFunction} next - Express next middleware function.
     * @returns {Promise<any>} - Resolves when the log-out from all devices process is complete.
     */
    async logOutFromAllDevices(req, res, next) {
        try {
            if (req.user) {
                req.user.tokens = [];
                await req.user.save();
                res.send('Logged out from all devices successfully');
            }
            else {
                return res.status(404).json({ error: 'user not found' });
            }
        }
        catch (error) {
            res.status(500).send(`Error during log-out from all devices: ${error.message}`);
        }
    }
}
exports.userController = new UserController();
