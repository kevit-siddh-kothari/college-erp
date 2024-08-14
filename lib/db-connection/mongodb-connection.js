"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionToDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectionToDb = async (url) => {
    if (url) {
        await mongoose_1.default
            .connect(url)
            .then(() => console.log(`mongodb connected sucessfully !`))
            .catch((err) => console.log(err));
        return;
    }
    console.log(`mongodb failed to connect`);
};
exports.connectionToDb = connectionToDb;
