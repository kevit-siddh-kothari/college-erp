import { Router } from 'express';
import {
  getAllDepartment,
  addDepartment,
  updateDepartmentById,
  deleteDepartmentById,
  deleteAllDepartment,
} from '../controller/department.controller';
import { authentication } from '../../../middlewear/auth';
import { authorizationAdmin } from '../../../middlewear/authorization';
const departmentRouter = Router();

departmentRouter.get('/all-department', authentication, authorizationAdmin, getAllDepartment);
departmentRouter.post('/add-department', authentication, authorizationAdmin, addDepartment);
departmentRouter.put('/update-department/:id', authentication, authorizationAdmin, updateDepartmentById);
departmentRouter.delete('/delete-department/:id', authentication, authorizationAdmin, deleteDepartmentById);
departmentRouter.delete('/deleteall-department', authentication, authorizationAdmin, deleteAllDepartment);

export { departmentRouter };
