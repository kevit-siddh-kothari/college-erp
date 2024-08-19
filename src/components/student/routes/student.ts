import { Router } from 'express';
import {
  addStudent,
  updateStudentById,
  deleteAllStudents,
  deleteStudentById,
  getAllStudent,
} from '../controller/student.controller';
import { authentication } from '../../../middlewear/auth';
const studentRouter = Router();

studentRouter.get('/all-students', authentication, getAllStudent);
studentRouter.post('/add-student', authentication, addStudent);
studentRouter.put('/update-student/:id', authentication, updateStudentById);
studentRouter.delete('/delete-student/:id', authentication, deleteStudentById);
studentRouter.delete('/deleteall-students', authentication, deleteAllStudents);

export { studentRouter };
