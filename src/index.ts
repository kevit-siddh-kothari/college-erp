import dotenv from 'dotenv';
import express, { Application } from 'express';
import { connectionToDb } from './db-connection/mongodb-connection';
import { studentRouter } from './components/student/student.routes';
import { userRouter } from './components/user/user.routes';
import { departmentRouter } from './components/department/department.route';
import { attendanceRouter } from './components/attendance/attendance.routes';
import { batchRouter } from './components/batch/batch.routes';
import { authentication } from './middlewear/auth.middlewear';
import { authorizationAdmin } from './middlewear/authorization.middlewear';
import { authorizationAdminOrStaff } from './middlewear/AuthorizationAdminOrStaffMember';
import { authorizationStudent } from './middlewear/authorizationStudent';
import { studentInfRouter } from './components/studentInf/stydentInf.route';
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
app.use('/api/students', authentication, authorizationAdminOrStaff, studentRouter);
app.use('/api/departments', authentication, authorizationAdmin, departmentRouter);
app.use('/api/attendance', authentication, authorizationAdminOrStaff, attendanceRouter);
app.use('/api/batch', authentication, authorizationAdmin, batchRouter);
app.use('/student', authentication, authorizationStudent, studentInfRouter);

export { app, port };
