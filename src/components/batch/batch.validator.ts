import { body } from 'express-validator';

const addBatch: any[] = [
  body('year').notEmpty().isNumeric().withMessage(`year is required`),
  body('totalStudentsIntake').notEmpty().isNumeric().withMessage(`total student are required`),
  body('availableSeats').notEmpty().isNumeric().withMessage(`available seats i required`),
  body('occupiedSeats').notEmpty().isNumeric().withMessage(`occupies seats is required`),
  body('department').notEmpty().isString().withMessage(`department is required`),
];

export { addBatch };
