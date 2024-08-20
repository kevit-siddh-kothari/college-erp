import { Router } from 'express';
import {
  getAllDepartment,
  addDepartment,
  updateDepartmentById,
  deleteDepartmentById,
  deleteAllDepartment,
} from '../controller/department.controller';
import { authentication } from '../../../middlewear/auth';
const departmentRouter = Router();

departmentRouter.get('/all-department', authentication, getAllDepartment);
departmentRouter.post('/add-department', authentication, addDepartment);
departmentRouter.put('/update-department/:id', authentication, updateDepartmentById);
departmentRouter.delete('/delete-department/:id', authentication, deleteDepartmentById);
departmentRouter.delete('/deleteall-department', authentication, deleteAllDepartment);

export { departmentRouter };
