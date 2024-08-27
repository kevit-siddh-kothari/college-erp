import dotenv from 'dotenv';
import express, { Application } from 'express';
import { connectionToDb } from './db-connection/mongodb-connection';
import { studentRouter } from './components/student/routes/student.routes';
import { userRouter } from './components/user/routes/user.routes';
import { departmentRouter } from './components/department/routes/department.route';
import { attendanceRouter } from './components/attendance/routes/attendance.routes';
import { batchRouter } from './components/batch/routes/batch.routes';
import bodyParser from 'body-parser';

dotenv.config();

const connectionUrl: string = process.env.MONGODB_URL as string;
const port: string = process.env.PORT || '3000';

/**
 * Connect to the MongoDB database using the provided connection URL.
 *
 * @param {string} connectionUrl - The connection string for the MongoDB database.
 */
connectionToDb(connectionUrl);

const app: Application = express();

/*******************************
 * MIDDLEWARE - FOR PARSING USER DATA TO JSON
 *******************************/
app.use(bodyParser.raw({ inflate: true, limit: '100kb', type: 'application/json' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/*******************************
 * MIDDLEWARE - ROUTES
 *******************************/
app.use('/api/user', userRouter);
app.use('/api/students', studentRouter);
app.use('/api/departments', departmentRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/batch', batchRouter);

export { app, port };
