"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpValidator = exports.loginValidator = void 0;
const express_validator_1 = require("express-validator");
const loginValidator = [
    (0, express_validator_1.body)('username').isString().notEmpty().withMessage('username is required!'),
    (0, express_validator_1.body)('password').isString().notEmpty().withMessage('password is required!'),
];
exports.loginValidator = loginValidator;
const signUpValidator = [
    (0, express_validator_1.body)('password').isString().isLength({ min: 7 }).withMessage('password must be of minimum 7 characters!'),
    (0, express_validator_1.body)('username').isString().notEmpty().isEmail().withMessage('please enter a valid email format!'),
    (0, express_validator_1.body)('role')
        .isString()
        .notEmpty()
        .withMessage('Role is required')
        .isIn(['admin', 'staffmember', 'student'])
        .withMessage('Role must be either "admin" or "staffmember"'),
];
exports.signUpValidator = signUpValidator;
