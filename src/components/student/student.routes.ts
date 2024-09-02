import { Router } from 'express';
import { studentController } from './student.controller';
import { handleValidationErrors } from '../../middlewear/handlevalidationerror';
import {
  updateStudentValidator,
  addStudentValidator,
  deleteStudentByIdValidator,
  getAbsentOnDate,
} from './student.validator';
import {checkForBufferData} from '../../middlewear/checkForBufferData';
const studentRouter = Router();

studentRouter.get('/all-students', studentController.getAllStudent);

studentRouter.get('/getanalytics', studentController.getAnalyticsData);

studentRouter.get('/vacantseats', studentController.getVacantSeats);

studentRouter.get('/presentlessthan75', studentController.presentLessThan75);

studentRouter.get('/absent/:date', checkForBufferData, ...getAbsentOnDate, handleValidationErrors, studentController.getAbsentStudents);

studentRouter.post('/add-student', checkForBufferData, ...addStudentValidator, handleValidationErrors, studentController.addStudent);

studentRouter.put(
  '/update-student/:id',
  checkForBufferData,
  ...updateStudentValidator,
  handleValidationErrors,
  studentController.updateStudentById,
);

studentRouter.delete(
  '/delete-student/:id',
  checkForBufferData,
  ...deleteStudentByIdValidator,
  handleValidationErrors,
  studentController.deleteStudentById,
);

studentRouter.delete('/deleteall-students', studentController.deleteAllStudents);

export { studentRouter };
