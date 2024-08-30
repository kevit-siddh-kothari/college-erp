"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDepartmentValidator = exports.updateDepartmentValidator = exports.addDepartmentValidator = void 0;
const express_validator_1 = require("express-validator");
const addDepartmentValidator = [
    (0, express_validator_1.body)('departmentname').notEmpty().withMessage('Please enter a valid department name'),
];
exports.addDepartmentValidator = addDepartmentValidator;
const updateDepartmentValidator = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid department ID'),
    (0, express_validator_1.body)('departmentname').optional().notEmpty().withMessage('Please enter a valid department name'),
];
exports.updateDepartmentValidator = updateDepartmentValidator;
const deleteDepartmentValidator = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid department ID'),
];
exports.deleteDepartmentValidator = deleteDepartmentValidator;
