import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { IUser, User } from '../components/user/module/user.module';

interface AuthenticatedRequest extends Request {
  user?: IUser;
  token?: string;
}

const authentication = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '').trim();

    if (!token) {
      throw new Error('Token is missing');
    }

    const decoded = jwt.verify(token, 'thisismytoken') as { _id: string };
    const user = await User.findOne({ '_id': decoded._id, 'tokens.token': token });

    if (!user) {
      throw new Error('Authentication failed');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send('Please authenticate');
  }
};

export { authentication };
