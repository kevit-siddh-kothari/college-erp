import { batchController } from './batch.controller';
import { Router } from 'express';
import { handleValidationErrors } from '../../middlewear/handlevalidationerror';
import { addBatch } from './batch.validator';
const batchRouter = Router();

batchRouter.patch('/add-batch', ...addBatch, handleValidationErrors, batchController.addBatch);
batchRouter.get('/get-allbatch', batchController.getBatch);

export { batchRouter };
