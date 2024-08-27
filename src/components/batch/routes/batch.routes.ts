import { batchController } from '../controller/batch.controller';
import { Router } from 'express';
import { authorizationAdmin } from '../../../middlewear/authorization';
import { authentication } from '../../../middlewear/auth';
import * as validator from 'express-validator';
const batchRouter = Router();

batchRouter.post(
  '/add-batch',
  authentication,
  authorizationAdmin,
  validator.body('year').notEmpty().withMessage(`year is required`),
  validator.body('totalStudentsIntake').notEmpty().withMessage(`total student are required`),
  validator.body('availableSeats').notEmpty().withMessage(`available seats i required`),
  validator.body('occupiedSeats').notEmpty().withMessage(`occupies seats is required`),
  validator.body('department').notEmpty().withMessage(`department is required`),
  batchController.addBatch,
);
batchRouter.get('/get-allbatch', authentication, authorizationAdmin, batchController.getBatch);

export { batchRouter };
