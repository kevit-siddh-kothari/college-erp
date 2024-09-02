import { Request, Response } from 'express';
import { studentDAL } from './student.DAL'; // Import the DAL
import { IUser } from '../user/user.module';

interface AuthenticatedRequest extends Request {
  user?: IUser;
  token?: string;
}

class StudentInfoController {
  public async studentInf(req: AuthenticatedRequest, res: Response): Promise<any> {
    try {
      const { username } = req.params;
      if (req.user?.username === username) {
        const student = await studentDAL.findStudentByUsername(username);
        return res.send(student);
      } else {
        return res.status(403).send('You are not authorized to access this student\'s information!');
      }
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
}

export const student = new StudentInfoController();
