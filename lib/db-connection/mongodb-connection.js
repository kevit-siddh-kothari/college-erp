"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionToDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Establishes a connection to the MongoDB database.
 *
 * @param {string | undefined} url - The MongoDB connection URL.
 * @returns {Promise<void>} A promise that resolves when the connection is established or logs an error if it fails.
 */
const connectionToDb = async (url) => {
    if (url) {
        await mongoose_1.default
            .connect(url)
            .then(() => console.log('MongoDB connected successfully!'))
            .catch(err => console.log(err));
        return;
    }
    console.log('MongoDB failed to connect');
};
exports.connectionToDb = connectionToDb;
