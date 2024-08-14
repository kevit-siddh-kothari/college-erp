"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Create a schema corresponding to the document interface.
const usersSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['staffmember', 'admin'],
        default: 'staffmember',
    },
});
// Create a model.
const User = mongoose_1.default.model('User', usersSchema);
// Export the model.
exports.default = User;
