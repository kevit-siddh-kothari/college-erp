import { Router } from 'express';
import { studentController } from './student.controller';
import {handleValidationErrors} from '../../middlewear/handlevalidationerror';
import {updateStudentValidator, addStudentValidator, deleteStudentByIdValidator, getAbsentOnDate} from './student.validator';
const studentRouter = Router();

studentRouter.get('/all-students', studentController.getAllStudent);

studentRouter.get(
  '/getanalytics', 
  studentController.getAnalyticsData
);

studentRouter.get(
  '/vacantseats', 
  studentController.getVacantSeats
);

studentRouter.get(
  '/presentlessthan75', 
  studentController.presentLessThan75
);

studentRouter.get(
  '/absent/:date',
  ...getAbsentOnDate,
  handleValidationErrors,
  studentController.getAbsentStudents
);

studentRouter.post(
  '/add-student',
  ...addStudentValidator,
  handleValidationErrors,
  studentController.addStudent
);

studentRouter.put(
  '/update-student/:id',
  ...updateStudentValidator,
  handleValidationErrors,
  studentController.updateStudentById
);

studentRouter.delete(
  '/delete-student/:id',
  ...deleteStudentByIdValidator,
  handleValidationErrors,
  studentController.deleteStudentById
);

studentRouter.delete(
  '/deleteall-students',
  studentController.deleteAllStudents
);


export { studentRouter };
