import { body, param } from 'express-validator';
const addDepartmentValidator: any[] = [
  body('departmentname').notEmpty().isString().withMessage('Please enter a valid department name'),
];
const updateDepartmentValidator: any[] = [
  param('id').isMongoId().withMessage('Invalid department ID'),
  body('departmentname').optional().notEmpty().withMessage('Please enter a valid department name'),
];
const deleteDepartmentValidator: any[] = [param('id').isMongoId().withMessage('Invalid department ID')];
export { addDepartmentValidator, updateDepartmentValidator, deleteDepartmentValidator };
