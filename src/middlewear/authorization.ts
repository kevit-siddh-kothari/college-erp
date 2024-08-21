import { Request, Response, NextFunction } from 'express';
import { IUser, User } from '../components/user/module/user';
import { Console } from 'console';
interface AuthenticatedRequest extends Request {
  user?: IUser;
  token?: string;
}

const authorizationAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log(req.user?.role);
    if (req.user?.role === 'admin') {
      return next();
    }
    throw new Error(`only admins are authorized to this path !`);
  } catch (error: any) {
    res.status(401).send(error.message);
  }
};

export { authorizationAdmin };
