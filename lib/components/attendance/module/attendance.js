"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attendance = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
;
// Create a schema corresponding to the document interface.
const attendanceSchema = new mongoose_1.default.Schema({
    student: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'students',
        unique: true
    },
    department: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'departmnets',
    },
    present: {
        type: Number,
        default: 0
    },
    absent: {
        type: Number,
        default: 0
    }
}, { timestamps: true });
// Create a model.
const Attendance = mongoose_1.default.model('attendance', attendanceSchema);
exports.Attendance = Attendance;
