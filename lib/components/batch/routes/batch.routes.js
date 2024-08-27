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
exports.batchRouter = void 0;
const batch_controller_1 = require("../controller/batch.controller");
const express_1 = require("express");
const authorization_1 = require("../../../middlewear/authorization");
const auth_1 = require("../../../middlewear/auth");
const validator = __importStar(require("express-validator"));
const batchRouter = (0, express_1.Router)();
exports.batchRouter = batchRouter;
batchRouter.post('/add-batch', auth_1.authentication, authorization_1.authorizationAdmin, validator.body('year').notEmpty().withMessage(`year is required`), validator.body('totalStudentsIntake').notEmpty().withMessage(`total student are required`), validator.body('availableSeats').notEmpty().withMessage(`available seats i required`), validator.body('occupiedSeats').notEmpty().withMessage(`occupies seats is required`), validator.body('department').notEmpty().withMessage(`department is required`), batch_controller_1.batchController.addBatch);
batchRouter.get('/get-allbatch', auth_1.authentication, authorization_1.authorizationAdmin, batch_controller_1.batchController.getBatch);
