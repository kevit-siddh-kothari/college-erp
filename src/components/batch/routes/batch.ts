import { getBatch, addBatch } from '../controller/batch.controller';
import { Router } from 'express';
import { authorizationAdmin } from '../../../middlewear/authorization';
import { authentication } from '../../../middlewear/auth';
const batchRouter = Router();

batchRouter.post('/add-batch', authentication, authorizationAdmin, addBatch);
batchRouter.get('/get-allbatch', authentication, authorizationAdmin, getBatch);

export { batchRouter };
