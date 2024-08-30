import { body } from 'express-validator';

const loginValidator: any[] = [
  body('username').isString().notEmpty().withMessage('username is required!'),
  body('password').isString().notEmpty().withMessage('password is required!'),
];

const signUpValidator: any[] = [
  body('password').isString().isLength({ min: 7 }).withMessage('password must be of minimum 7 characters!'),
  body('username').isString().notEmpty().isEmail().withMessage('please enter a valid email format!'),
  body('role')
    .isString()
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['admin', 'staffmember', 'student'])
    .withMessage('Role must be either "admin" or "staffmember"'),
];

export { loginValidator, signUpValidator };
