import { Request, Response, NextFunction } from 'express';
import { User, IUser } from './user.module';
import bcrypt from 'bcrypt';
import * as jwt from './jwt.token';
import {logger} from '../../utils/winstone.logger';

// Extending the Request interface to include user and token properties for authenticated requests
interface AuthenticatedRequest extends Request {
  user?: IUser;
  token?: string;
}

/**
 * UserController class to handle user sign-up, log-in, log-out, and log-out from all devices operations.
 */
class UserController {
  /**
   * Handles user sign-up requests by creating a new user and saving it to the database.
   *
   * @param {Request} req - Express request object containing the user data in the body.
   * @param {Response} res - Express response object used to send the response.
   * @returns {Promise<any>} - Resolves when the sign-up process is complete.
   * @throws {Error} Will throw an error if user data is missing or if saving the user fails.
   */
  public async signUp(req: Request, res: Response): Promise<any> {
    try {
      const { username, password, role } = req.body;
      const user = new User({ username, password, role });
      await user.save();
      logger.info(`User created successfully`);
      return res.status(201).json({message:'User created successfully'});
    } catch (error: any) {
      logger.error(`Error during sign-up: ${error.message}`);
      return res.status(500).json({error: error.message});
    }
  }

  /**
   * Handles user log-in requests by verifying credentials and generating a JWT token.
   *
   * @param {Request} req - Express request object containing the user credentials in the body.
   * @param {Response} res - Express response object used to send the response.
   * @returns {Promise<any>} - Resolves when the log-in process is complete.
   * @throws {Error} Will throw an error if the username is invalid or credentials are incorrect.
   */
  public async logIn(req: Request, res: Response): Promise<any> {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        logger.error(`User not found`);
        return res.status(404).json({ error: 'user not found' });
      }

      const match = bcrypt.compareSync(password, user.password);
      if (match) {
        const token = await jwt.generateToken(user);
        return res.json({ user, token });
      } else {
        logger.error(`password is incorrect`);
        return res.status(401).json({ error: 'Password is incorrect' });
      }
    } catch (error: any) {
      logger.error(`Error during log-in: ${error.message}`);
      res.status(500).json({error: error.message});
    }
  }

  /**
   * Handles user log-out requests by removing the current token from the user's token list.
   *
   * @param {AuthenticatedRequest} req - Authenticated request object containing user and token information.
   * @param {Response} res - Express response object used to send the response.
   * @param {NextFunction} next - Express next middleware function.
   * @returns {Promise<any>} - Resolves when the log-out process is complete.
   */
  public async logOut(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.user || !req.token) {
        return res.status(400).json({error:'User or token not found'});
      }
      if (req.user && req.token) {
        req.user.tokens = req.user.tokens.filter((token: { token: string }) => token.token !== req.token);
        await req.user.save();
        return res.json({message:'Logged out successfully'});
      } else {
        return res.status(404).json({ error: 'user token not found' });
      }
    } catch (error: any) {
      logger.error(`Error during log-out: ${error.message}`);
      return res.status(500).json({error:`Error during log-out: ${error.message}`});
    }
  }

  /**
   * Handles user log-out requests from all devices by clearing the user's token list.
   *
   * @param {AuthenticatedRequest} req - Authenticated request object containing user information.
   * @param {Response} res - Express response object used to send the response.
   * @param {NextFunction} next - Express next middleware function.
   * @returns {Promise<any>} - Resolves when the log-out from all devices process is complete.
   */
  public async logOutFromAllDevices(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      if (req.user) {
        req.user.tokens = [];
        await req.user.save();
        res.json({error:'Logged out from all devices successfully'});
      } else {
        return res.status(404).json({ error: 'user not found' });
      }
    } catch (error: any) {
      res.status(500).json({error:`Error during log-out from all devices: ${error.message}`});
    }
  }
}

export const userController = new UserController();
