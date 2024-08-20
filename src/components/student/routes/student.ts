import { Router } from 'express';
import {
  addStudent,
  updateStudentById,
  deleteAllStudents,
  deleteStudentById,
  getAllStudent,
  getAbsentStudents,
  getAnalyticsData,
  getVacantSeats,
} from '../controller/student.controller';
import { authentication } from '../../../middlewear/auth';
const studentRouter = Router();

studentRouter.get('/all-students', authentication, getAllStudent);
studentRouter.get('/getanalytics', authentication, getAnalyticsData);
studentRouter.get('/vacantseats', getVacantSeats);
studentRouter.get('/:date', authentication, getAbsentStudents);
studentRouter.post('/add-student', addStudent);
studentRouter.put('/update-student/:id', authentication, updateStudentById);
studentRouter.delete('/delete-student/:id', authentication, deleteStudentById);
studentRouter.delete('/deleteall-students', authentication, deleteAllStudents);

export { studentRouter };
