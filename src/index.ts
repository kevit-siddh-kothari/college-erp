import dotenv from 'dotenv';
import express from 'express';
import { connectionToDb } from './db-connection/mongodb-connection';
import {} from './components/student/routes/student';
import {} from './components/user/routes/user.admin';
import {} from './components/user/routes/user.staffmembers';
import {} from './components/department/routes/department';
import {} from './components/batch/routes/batch';
import {} from './components/attendance/routes/attendance';
dotenv.config();

const connectionUrl: string | undefined = process.env.MONGODB_URL;
const port: string | undefined = process.env.PORT;

connectionToDb(connectionUrl)

const app = express()


/*******************************
        MIDDLEWEAR
 *******************************/
app.use('/api/staffmembers', );
app.use('/api/admin');
app.use('/api/students');
app.use('/api/departments');
app.use('/api/attendance');
app.use('/api/batch');

export { app, port };
