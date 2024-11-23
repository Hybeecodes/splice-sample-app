import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

export interface IUserRepository extends Repository<User> {
  findUserById(userId: string): Promise<User>;

  findByEmail(email: string): Promise<User | null>;

  createUser(user: Partial<User>): Promise<User>;

  updateUser(userId: string, payload: Partial<User>): Promise<User>;
}
