import { Router } from 'express';
import { student } from './studentinf.controller';

const studentInfRouter = Router();

studentInfRouter.get('/getInformation/:username', student.studentInf);

export { studentInfRouter };
