import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { IUserRepository } from '../interfaces/user.repository.interface';

@Injectable()
export class UserRepository
  extends Repository<User>
  implements IUserRepository
{
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  }

  async createUser(data: Partial<User>): Promise<User> {
    const user = this.create(data);
    return this.save(user);
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    await this.update(id, updates);
    return this.findOneBy({ id });
  }

  async findUserById(userId: string): Promise<User> {
    return this.findOneBy({ id: userId });
  }
}
