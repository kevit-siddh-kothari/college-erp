// dal/UserDAL.ts
import { User, IUser } from './user.module';

class UserDAL {
  // Find a user by username
  public async findByUsername(username: string): Promise<IUser | null> {
    return  User.findOne({ username });
  }

  // Save a new user to the database
  public async saveUser(user: IUser): Promise<IUser> {
    return  user.save();
  }

  // Update a user's token list (e.g., for logout)
  public async updateUserTokens(user: IUser, tokens: any[]): Promise<IUser | null> {
    user.tokens = tokens;
    return  user.save();
  }
}

export const userDAL = new UserDAL();
