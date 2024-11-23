import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from "../../../src/modules/user/entities/user.entity";
import { IUserRepository } from "../../../src/modules/user/interfaces/user.repository.interface";

@Injectable()
export class MockUserRepository
  extends Repository<User>
  implements IUserRepository
{
  createUser(user: Partial<User>): Promise<User> {
    return Promise.resolve(undefined);
  }

  findUserByEmail(email: string): Promise<User> {
    return Promise.resolve(undefined);
  }

  findUserById(userId: string): Promise<User> {
    return Promise.resolve(undefined);
  }

  updateUser(userId: string, payload: Partial<User>): Promise<User> {
    return Promise.resolve(undefined);
  }

  findByEmail(email: string): Promise<User | null> {
    return Promise.resolve(undefined);
  }

}
