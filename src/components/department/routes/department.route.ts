import { Router } from 'express';
import * as validator from 'express-validator';
import { departmentController } from '../controller/department.controller';
import { authentication } from '../../../middlewear/auth';
import { authorizationAdmin } from '../../../middlewear/authorization';
const departmentRouter = Router();

departmentRouter.get('/all-department', authentication, authorizationAdmin, departmentController.getAllDepartment);
departmentRouter.post(
  '/add-department',
  authentication,
  authorizationAdmin,
  validator.body('departmentname').notEmpty().withMessage(`Please enter a valid department`),
  departmentController.addDepartment,
);
departmentRouter.put(
  '/update-department/:id',
  authentication,
  authorizationAdmin,
  departmentController.updateDepartmentById,
);
departmentRouter.delete(
  '/delete-department/:id',
  authentication,
  authorizationAdmin,
  departmentController.deleteDepartmentById,
);
departmentRouter.delete(
  '/deleteall-department',
  authentication,
  authorizationAdmin,
  departmentController.deleteAllDepartment,
);

export { departmentRouter };
