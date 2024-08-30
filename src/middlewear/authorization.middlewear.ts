import { Request, Response, NextFunction } from 'express';
import { IUser, User } from '../components/user/user.module';
import { Console } from 'console';
interface AuthenticatedRequest extends Request {
  user?: IUser;
  token?: string;
}

const authorizationAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user?.role === 'admin') {
      return next();
    }
    res.status(403).send(`only admins are authorized to this path !`)
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export { authorizationAdmin };
