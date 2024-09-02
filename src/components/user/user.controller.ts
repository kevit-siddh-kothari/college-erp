import { Request, Response, NextFunction } from 'express';
import { User, IUser } from './user.module';
import bcrypt from 'bcrypt';
import * as jwt from './jwt.token';
import { logger } from '../../utils/winstone.logger';
import {userDAL} from './user.DAL'; // Import the DAL

interface AuthenticatedRequest extends Request {
  user?: IUser;
  token?: string;
}

class UserController {
  public async signUp(req: Request, res: Response): Promise<any> {
    try {
      const { username, password, role } = req.body;
      const user = new User({ username, password, role });
      await userDAL.saveUser(user); // Use DAL to save the user
      logger.info(`User created successfully`);
      return res.status(201).json({ message: 'User created successfully' });
    } catch (error: any) {
      logger.error(`Error during sign-up: ${error.message}`);
      return res.status(500).json({ error: error.message });
    }
  }

  public async logIn(req: Request, res: Response): Promise<any> {
    try {
      const { username, password } = req.body;
      const user = await userDAL.findByUsername(username); // Use DAL to find the user
      if (!user) {
        logger.error(`User not found`);
        return res.status(404).json({ error: 'user not found' });
      }

      const match = bcrypt.compareSync(password, user.password);
      if (match) {
        const token = await jwt.generateToken(user);
        logger.info('Login successful!');
        return res.status(200).json({ user, token });
      } else {
        logger.error(`Password is incorrect`);
        return res.status(401).json({ error: 'Password is incorrect' });
      }
    } catch (error: any) {
      logger.error(`Error during log-in: ${error.message}`);
      return res.status(500).json({ error: error.message });
    }
  }

  public async logOut(req: AuthenticatedRequest, res: Response): Promise<any> {
    try {
      if (!req.user || !req.token) {
        return res.status(400).json({ error: 'User or token not found' });
      }

      if (req.user && req.token) {
        req.user.tokens = req.user.tokens.filter((token: { token: string }) => token.token !== req.token);
        await userDAL.updateUserTokens(req.user, req.user.tokens); // Use DAL to update tokens
        return res.status(200).json({ message: 'Logged out successfully' });
      } else {
        return res.status(404).json({ error: 'User token not found' });
      }
    } catch (error: any) {
      logger.error(`Error during log-out: ${error.message}`);
      return res.status(500).json({ error: `Error during log-out: ${error.message}` });
    }
  }

  public async logOutFromAllDevices(req: AuthenticatedRequest, res: Response): Promise<any> {
    try {
      if (req.user) {
        req.user.tokens = [];
        await userDAL.updateUserTokens(req.user, req.user.tokens); // Use DAL to update tokens
        return res.status(200).json({ message: 'Logged out from all devices successfully' });
      } else {
        return res.status(404).json({ error: 'User not found' });
      }
    } catch (error: any) {
      logger.error(`Error during log-out from all devices: ${error.message}`);
      return res.status(500).json({ error: `Error during log-out from all devices: ${error.message}` });
    }
  }
}

export const userController = new UserController();
