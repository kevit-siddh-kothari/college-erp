import { Router } from 'express';
import { attendanceController } from '../controller/attendance.controller';
import { authentication } from '../../../middlewear/auth';
import * as validator from 'express-validator';
const attendanceRouter = Router();

attendanceRouter.get('/all-attendance', authentication, attendanceController.getAllStudentAttendance);
attendanceRouter.post('/add-attendance/:id', authentication, attendanceController.addAttendance);
attendanceRouter.put('/update-attendance/:id/:date', authentication, attendanceController.updateAttendance);

export { attendanceRouter };
