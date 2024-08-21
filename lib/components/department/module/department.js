"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Department = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Create a schema corresponding to the document interface.
const departmentSchema = new mongoose_1.default.Schema({
    departmentname: {
        type: String,
        required: true,
        unique: true,
    },
}, { timestamps: true });
// Create a model.
const Department = mongoose_1.default.model('departments', departmentSchema);
exports.Department = Department;
