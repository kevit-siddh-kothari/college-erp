import { Router } from 'express';
import * as validator from 'express-validator';
import { studentController } from '../controller/student.controller';
import { authentication } from '../../../middlewear/auth';
const studentRouter = Router();

studentRouter.get('/all-students', authentication, studentController.getAllStudent);
studentRouter.get('/getanalytics', authentication, studentController.getAnalyticsData);
studentRouter.get('/vacantseats', authentication, studentController.getVacantSeats);
studentRouter.get('/presentlessthan75', authentication, studentController.presentLessThan75);
studentRouter.get('/absent/:date', authentication, studentController.getAbsentStudents);
studentRouter.post(
  '/add-student',
  authentication,
  validator.body('name').notEmpty().withMessage('name is required'),
  validator.body('phno').notEmpty().withMessage('phone number is required'),
  validator.body('departmentname').notEmpty().withMessage('department is required'),
  validator.body('batch').notEmpty().withMessage('batch is required'),
  validator.body('currentsem').notEmpty().withMessage('current semeater is required'),
  studentController.addStudent,
);
studentRouter.put('/update-student/:id', authentication, studentController.updateStudentById);
studentRouter.delete('/delete-student/:id', authentication, studentController.deleteStudentById);
studentRouter.delete('/deleteall-students', authentication, studentController.deleteAllStudents);

export { studentRouter };
