"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
/**
 * Create a schema corresponding to the document interface.
 */
const usersSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
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
    tokens: [
        {
            token: {
                type: String,
            },
        },
    ],
}, { timestamps: true });
/********************************************************
 * MIDDLEWARE FOR HANDLING SAVE EVENT and diffrent methods
 ********************************************************/
usersSchema.pre('save', function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = bcrypt_1.default.hashSync(user.password, 10);
    }
    next();
});
usersSchema.methods.getPublicProfile = function () {
    const user = this;
    const userObject = JSON.parse(JSON.stringify(user));
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
};
/**
 * Create a model based on the schema and interface.
 */
const User = mongoose_1.default.model('users', usersSchema);
exports.User = User;
