"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAbsentOnDate = exports.addStudentValidator = exports.deleteStudentByIdValidator = exports.updateStudentValidator = void 0;
const express_validator_1 = require("express-validator");
const updateStudentValidator = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid student ID'),
    (0, express_validator_1.body)('username').notEmpty().isString().withMessage('userName is required'),
    (0, express_validator_1.body)('name').optional().isString().notEmpty().withMessage('Name cannot be empty'),
    (0, express_validator_1.body)('phno').optional().isNumeric().withMessage('Phone number must be numeric'),
    (0, express_validator_1.body)('departmentid').optional().notEmpty().withMessage('Department cannot be empty'),
    (0, express_validator_1.body)('batch').optional().notEmpty().withMessage('Batch cannot be empty'),
    (0, express_validator_1.body)('currentsem').optional().isInt({ min: 1 }).withMessage('Current semester must be a positive integer'),
];
exports.updateStudentValidator = updateStudentValidator;
const deleteStudentByIdValidator = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid student ID'),
];
exports.deleteStudentByIdValidator = deleteStudentByIdValidator;
const addStudentValidator = [
    (0, express_validator_1.body)('username').notEmpty().isString().withMessage('userName is required'),
    (0, express_validator_1.body)('name').notEmpty().isString().withMessage('Name is required'),
    (0, express_validator_1.body)('phno').notEmpty().isNumeric().withMessage('Phone number is required and must be numeric'),
    (0, express_validator_1.body)('departmentid').notEmpty().withMessage('Department is required'),
    (0, express_validator_1.body)('batch').notEmpty().withMessage('Batch is required'),
    (0, express_validator_1.body)('currentsem').notEmpty().isInt({ min: 1 }).withMessage('Current semester is required and must be a positive integer'),
];
exports.addStudentValidator = addStudentValidator;
const getAbsentOnDate = [
    (0, express_validator_1.param)('date').isISO8601().withMessage('Please provide a valid date in YYYY-MM-DD format'),
];
exports.getAbsentOnDate = getAbsentOnDate;
