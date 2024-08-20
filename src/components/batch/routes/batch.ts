import { getBatch, addBatch } from '../controller/batch.controller';
import { Router } from 'express';

const batchRouter = Router();

batchRouter.post('/add-batch', addBatch);
batchRouter.get('/get-allbatch', getBatch);

export { batchRouter };
