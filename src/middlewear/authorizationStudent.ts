import { Request, Response, NextFunction } from 'express';
import { IUser, User } from '../components/user/user.module';
import { Console } from 'console';
interface AuthenticatedRequest extends Request {
  user?: IUser;
  token?: string;
}

const authorizationStudent = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user?.role === 'student') {
      console.log('hell');
      return next();
    }
    res.status(403).send(`only students are authorized to this path !`);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export { authorizationStudent };
