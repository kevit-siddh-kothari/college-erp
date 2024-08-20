import { Request, Response, NextFunction } from 'express';
import { IUser, User } from '../components/user/module/user';
interface AuthenticatedRequest extends Request {
  user?: IUser;
  token?: string;
}

const authorizationAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (req.user?.role === 'admin') {
    next();
  }
  res.send(`Only admins are authrnticated to this routes !`);
};

module.exports = { authorizationAdmin };
