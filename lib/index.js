"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = exports.app = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongodb_connection_1 = require("./db-connection/mongodb-connection");
const student_1 = require("./components/student/routes/student");
const user_1 = require("./components/user/routes/user");
const department_1 = require("./components/department/routes/department");
const attendance_1 = require("./components/attendance/routes/attendance");
dotenv_1.default.config();
const connectionUrl = process.env.MONGODB_URL;
const port = process.env.PORT || '3000';
exports.port = port;
/**
 * Connect to the MongoDB database using the provided connection URL.
 *
 * @param {string} connectionUrl - The connection string for the MongoDB database.
 */
(0, mongodb_connection_1.connectionToDb)(connectionUrl);
const app = (0, express_1.default)();
exports.app = app;
/*******************************
 * MIDDLEWARE - FOR PARSING USER DATA TO JSON
 *******************************/
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
/*******************************
 * MIDDLEWARE - ROUTES
 *******************************/
app.use('/api/user', user_1.userRouter);
app.use('/api/students', student_1.studentRouter);
app.use('/api/departments', department_1.departmentRouter);
app.use('/api/attendance', attendance_1.attendanceRouter);
