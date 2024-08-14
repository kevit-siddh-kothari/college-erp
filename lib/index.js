"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = exports.app = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const mongodb_connection_1 = require("./db-connection/mongodb-connection");
const express_1 = __importDefault(require("express"));
dotenv_1.default.config();
const connectionUrl = process.env.MONGODB_URL;
const port = process.env.PORT;
exports.port = port;
(0, mongodb_connection_1.connectionToDb)(connectionUrl);
const app = (0, express_1.default)();
exports.app = app;
