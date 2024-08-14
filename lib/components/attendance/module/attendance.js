"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Create a schema corresponding to the document interface.
const attendanceSchema = new mongoose_1.default.Schema({
    student: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'students',
    },
    date: {
        type: Date,
        required: true,
    },
    attendance: {
        type: String,
        enum: ['present', 'absent'],
    },
});
// Create a model.
const Attendance = mongoose_1.default.model('attendance', attendanceSchema);
// Export the model.
exports.default = Attendance;
