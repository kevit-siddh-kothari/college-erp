import { Router } from 'express';
import { departmentController } from './department.controller';
import {handleValidationErrors} from '../../middlewear/handlevalidationerror';
import {addDepartmentValidator, updateDepartmentValidator, deleteDepartmentValidator} from './validators/departmet.validator'
const departmentRouter = Router();

departmentRouter.get(
  '/all-department',
  departmentController.getAllDepartment
);

departmentRouter.post(
  '/add-department',
  ...addDepartmentValidator,
  handleValidationErrors,
  departmentController.addDepartment
);

departmentRouter.put(
  '/update-department/:id',
  ...updateDepartmentValidator,
  handleValidationErrors,
  departmentController.updateDepartmentById
);

departmentRouter.delete(
  '/delete-department/:id',
  ...deleteDepartmentValidator,
  handleValidationErrors,
  departmentController.deleteDepartmentById
);

departmentRouter.delete(
  '/deleteall-department',
  departmentController.deleteAllDepartment
);
export { departmentRouter };
