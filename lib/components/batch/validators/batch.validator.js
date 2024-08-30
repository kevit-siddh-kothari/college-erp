"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBatch = void 0;
const express_validator_1 = require("express-validator");
const addBatch = [
    (0, express_validator_1.body)('year').notEmpty().isNumeric().withMessage(`year is required`),
    (0, express_validator_1.body)('totalStudentsIntake').notEmpty().isNumeric().withMessage(`total student are required`),
    (0, express_validator_1.body)('availableSeats').notEmpty().isNumeric().withMessage(`available seats i required`),
    (0, express_validator_1.body)('occupiedSeats').notEmpty().isNumeric().withMessage(`occupies seats is required`),
    (0, express_validator_1.body)('department').notEmpty().isString().withMessage(`department is required`),
];
exports.addBatch = addBatch;
