import { User, IUser } from '../module/user'; // Assuming IUser is the interface for User
import * as jwt from 'jsonwebtoken';

/**
 * Generates a jwt token for the given user, stores it in the user's token array, and saves the user.
 *
 * @param {IUser} user - The user object for which the token is generated.
 * @returns {Promise<string>} - Returns a promise that resolves to the generated token.
 */
const generateToken = async function (user: IUser): Promise<string> {
  const token = jwt.sign({ _id: user._id.toString() }, 'thisismytoken');

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

export { generateToken };
