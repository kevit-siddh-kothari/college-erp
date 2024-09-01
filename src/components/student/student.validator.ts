import { param, body } from 'express-validator';

const updateStudentValidator: any[] = [
  param('id').isMongoId().withMessage('Invalid student ID'),
  body('username').optional().isString().withMessage('userName is required'),
  body('name').optional().isString().notEmpty().withMessage('Name cannot be empty'),
  body('phno').optional().isNumeric().withMessage('Phone number must be numeric'),
  body('departmentid').optional().notEmpty().withMessage('Department cannot be empty'),
  body('batch').optional().notEmpty().withMessage('Batch cannot be empty'),
  body('currentsem').optional().isInt({ min: 1 }).withMessage('Current semester must be a positive integer'),
];

const deleteStudentByIdValidator: any[] = [param('id').isMongoId().withMessage('Invalid student ID')];

const addStudentValidator: any[] = [
  body('username').notEmpty().isString().withMessage('userName is required'),
  body('name').notEmpty().isString().withMessage('Name is required'),
  body('phno').notEmpty().isNumeric().withMessage('Phone number is required and must be numeric'),
  body('departmentid').isMongoId().notEmpty().withMessage('Department is required'),
  body('batch').isMongoId().notEmpty().withMessage('Batch is required'),
  body('currentsem')
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage('Current semester is required and must be a positive integer'),
];

const getAbsentOnDate: any[] = [
  param('date').isISO8601().withMessage('Please provide a valid date in YYYY-MM-DD format'),
];

export { updateStudentValidator, deleteStudentByIdValidator, addStudentValidator, getAbsentOnDate };
