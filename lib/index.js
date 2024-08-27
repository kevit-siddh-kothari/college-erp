"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = exports.app = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongodb_connection_1 = require("./db-connection/mongodb-connection");
const student_routes_1 = require("./components/student/routes/student.routes");
const user_routes_1 = require("./components/user/routes/user.routes");
const department_route_1 = require("./components/department/routes/department.route");
const attendance_routes_1 = require("./components/attendance/routes/attendance.routes");
const batch_routes_1 = require("./components/batch/routes/batch.routes");
const body_parser_1 = __importDefault(require("body-parser"));
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
app.use(body_parser_1.default.raw({ inflate: true, limit: '100kb', type: 'application/json' }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
/*******************************
 * MIDDLEWARE - ROUTES
 *******************************/
app.use('/api/user', user_routes_1.userRouter);
app.use('/api/students', student_routes_1.studentRouter);
app.use('/api/departments', department_route_1.departmentRouter);
app.use('/api/attendance', attendance_routes_1.attendanceRouter);
app.use('/api/batch', batch_routes_1.batchRouter);
