"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Create a schema corresponding to the document interface.
const studentSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    phno: {
        type: Number,
        required: true,
    },
    department: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'departments',
    },
    batch: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'batches',
        required: true,
    },
    currentsem: {
        type: Number,
        required: true,
    },
});
// Create a model.
const Student = mongoose_1.default.model('students', studentSchema);
exports.Student = Student;
