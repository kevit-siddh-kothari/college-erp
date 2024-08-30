import { Router } from 'express';
import { attendanceController } from './attendance.controller';
import * as validator from 'express-validator';
const attendanceRouter = Router();

attendanceRouter.get('/all-attendance', attendanceController.getAllStudentAttendance);
attendanceRouter.post('/add-attendance/:id', attendanceController.addAttendance);
attendanceRouter.put('/update-attendance/:id/:date', attendanceController.updateAttendance);

export { attendanceRouter };
