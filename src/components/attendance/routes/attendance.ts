import { Router } from 'express';
import { updateAttendance, getAllStudentAttendance } from '../controller/attendance.controller';
import { authentication } from '../../../middlewear/auth';
const attendanceRouter = Router();

attendanceRouter.get('/all-attendance', authentication, getAllStudentAttendance);
attendanceRouter.post('/update-attendance/:id', authentication, updateAttendance);

export { attendanceRouter };
