import { Request, Response, NextFunction } from 'express';
import { User, IUser } from '../module/user.module';
import bcrypt from 'bcrypt';
import * as jwt from '../services/jwt.token';
import { Result, validationResult } from 'express-validator';

// Extending the Request interface to include user and token properties for authenticated requests
interface AuthenticatedRequest extends Request {
  user?: IUser;
  token?: string;
}

/**
 * Handles user sign-up requests by creating a new user and saving it to the database.
 *
 * @param {Request} req - Express request object containing the user data in the body.
 * @param {Response} res - Express response object used to send the response.
 * @returns {Promise<void>} - Resolves when the sign-up process is complete.
 * @throws Will throw an error if user data is missing or if saving the user fails.
 */
const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    // const { username, password, role }: { username: string; password: string; role: string } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Throw an error with the validation errors
      throw new Error(JSON.stringify({ errors: errors.array() }));
    }
    // Create a new user and save to the database
    const user = new User({ username: req.body.username, password: req.body.password, role: req.body.role });
    await user.save();

    res.status(201).send('User created successfully');
  } catch (error: any) {
    console.error(`Error during sign-up: ${error.message}`);
    res.status(400).send(error.message);
  }
};

/**
 * Handles user log-in requests by verifying credentials and generating a JWT token.
 *
 * @param {Request} req - Express request object containing the user credentials in the body.
 * @param {Response} res - Express response object used to send the response.
 * @returns {Promise<void>} - Resolves when the log-in process is complete.
 * @throws Will throw an error if the username is invalid or credentials are incorrect.
 */
const logIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Throw an error with the validation errors
      throw new Error(JSON.stringify({ errors: errors.array() }));
    }
    // Find user by username
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      throw new Error('Username is invalid');
    }

    // Compare password with hashed password in database
    const match = bcrypt.compareSync(req.body.password, user.password);
    if (match) {
      // Generate JWT token
      const token = await jwt.generateToken(user);
      res.send({ user, token });
    } else {
      throw new Error('Incorrect Credentials');
    }
  } catch (error: any) {
    console.error(`Error during log-in: ${error.message}`);
    res.status(401).send(error.message);
  }
};

/**
 * Handles user log-out requests by removing the current token from the user's token list.
 *
 * @param {AuthenticatedRequest} req - Authenticated request object containing user and token information.
 * @param {Response} res - Express response object used to send the response.
 * @param {NextFunction} next - Express next middleware function.
 * @returns {Promise<void>} - Resolves when the log-out process is complete.
 */
const logOut = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user && req.token) {
      // Remove the current token from user's tokens list
      req.user.tokens = req.user.tokens.filter((token: { token: string }) => token.token !== req.token);
      await req.user.save();
      res.send('Logged out successfully');
    } else {
      throw new Error('User or token not found');
    }
  } catch (error: any) {
    res.status(500).send(`Error during log-out: ${error.message}`);
  }
};

/**
 * Handles user log-out requests from all devices by clearing the user's token list.
 *
 * @param {AuthenticatedRequest} req - Authenticated request object containing user information.
 * @param {Response} res - Express response object used to send the response.
 * @param {NextFunction} next - Express next middleware function.
 * @returns {Promise<void>} - Resolves when the log-out from all devices process is complete.
 */
const logOutFromAllDevices = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user) {
      // Clear all tokens for the user
      req.user.tokens = [];
      await req.user.save();
      res.send('Logged out from all devices successfully');
    } else {
      throw new Error('User not found');
    }
  } catch (error: any) {
    res.status(500).send(`Error during log-out from all devices: ${error.message}`);
  }
};

export { signUp, logIn, logOut, logOutFromAllDevices };
