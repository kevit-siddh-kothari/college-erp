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
exports.logOutFromAllDevices = exports.logOut = exports.logIn = exports.signUp = void 0;
const user_1 = require("../module/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt = __importStar(require("../services/jwt.token"));
const express_validator_1 = require("express-validator");
/**
 * Handles user sign-up requests by creating a new user and saving it to the database.
 *
 * @param {Request} req - Express request object containing the user data in the body.
 * @param {Response} res - Express response object used to send the response.
 * @returns {Promise<void>} - Resolves when the sign-up process is complete.
 * @throws Will throw an error if user data is missing or if saving the user fails.
 */
const signUp = async (req, res) => {
    try {
        // const { username, password, role }: { username: string; password: string; role: string } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            // Throw an error with the validation errors
            throw new Error(JSON.stringify({ errors: errors.array() }));
        }
        // Create a new user and save to the database
        const user = new user_1.User({ username: req.body.username, password: req.body.password, role: req.body.role });
        await user.save();
        res.status(201).send('User created successfully');
    }
    catch (error) {
        console.error(`Error during sign-up: ${error.message}`);
        res.status(400).send(error.message);
    }
};
exports.signUp = signUp;
/**
 * Handles user log-in requests by verifying credentials and generating a JWT token.
 *
 * @param {Request} req - Express request object containing the user credentials in the body.
 * @param {Response} res - Express response object used to send the response.
 * @returns {Promise<void>} - Resolves when the log-in process is complete.
 * @throws Will throw an error if the username is invalid or credentials are incorrect.
 */
const logIn = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            // Throw an error with the validation errors
            throw new Error(JSON.stringify({ errors: errors.array() }));
        }
        // Find user by username
        const user = await user_1.User.findOne({ username: req.body.username });
        if (!user) {
            throw new Error('Username is invalid');
        }
        // Compare password with hashed password in database
        const match = bcrypt_1.default.compareSync(req.body.password, user.password);
        if (match) {
            // Generate JWT token
            const token = await jwt.generateToken(user);
            res.send({ user, token });
        }
        else {
            throw new Error('Incorrect Credentials');
        }
    }
    catch (error) {
        console.error(`Error during log-in: ${error.message}`);
        res.status(401).send(error.message);
    }
};
exports.logIn = logIn;
/**
 * Handles user log-out requests by removing the current token from the user's token list.
 *
 * @param {AuthenticatedRequest} req - Authenticated request object containing user and token information.
 * @param {Response} res - Express response object used to send the response.
 * @param {NextFunction} next - Express next middleware function.
 * @returns {Promise<void>} - Resolves when the log-out process is complete.
 */
const logOut = async (req, res, next) => {
    try {
        if (req.user && req.token) {
            // Remove the current token from user's tokens list
            req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
            await req.user.save();
            res.send('Logged out successfully');
        }
        else {
            throw new Error('User or token not found');
        }
    }
    catch (error) {
        res.status(500).send(`Error during log-out: ${error.message}`);
    }
};
exports.logOut = logOut;
/**
 * Handles user log-out requests from all devices by clearing the user's token list.
 *
 * @param {AuthenticatedRequest} req - Authenticated request object containing user information.
 * @param {Response} res - Express response object used to send the response.
 * @param {NextFunction} next - Express next middleware function.
 * @returns {Promise<void>} - Resolves when the log-out from all devices process is complete.
 */
const logOutFromAllDevices = async (req, res, next) => {
    try {
        if (req.user) {
            // Clear all tokens for the user
            req.user.tokens = [];
            await req.user.save();
            res.send('Logged out from all devices successfully');
        }
        else {
            throw new Error('User not found');
        }
    }
    catch (error) {
        res.status(500).send(`Error during log-out from all devices: ${error.message}`);
    }
};
exports.logOutFromAllDevices = logOutFromAllDevices;
