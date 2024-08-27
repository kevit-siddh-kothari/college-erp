import { Router } from 'express';
import { updateAttendance, getAllStudentAttendance, addAttendance } from '../controller/attendance.controller';
import { authentication } from '../../../middlewear/auth';
import * as validator from'express-validator';
const attendanceRouter = Router();

attendanceRouter.get('/all-attendance', authentication, getAllStudentAttendance);
attendanceRouter.post('/add-attendance/:id',authentication, addAttendance);
attendanceRouter.put('/update-attendance/:id/:date', authentication, updateAttendance);

export { attendanceRouter };
