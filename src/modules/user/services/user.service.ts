import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Components } from '../../../shared/constants/enumerations';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserDto } from '../dtos/user.dto';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class UserService {
  constructor(
    @Inject(Components.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @InjectPinoLogger(UserService.name)
    private readonly logger: PinoLogger,
  ) {}

  async findUserByEmail(email: string): Promise<UserDto> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      this.logger.info(`User with email ${email} not found`);
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return new UserDto(user);
  }

  async createUser(data: CreateUserDto): Promise<UserDto> {
    this.logger.info(`Creating user with data ${JSON.stringify(data)}`);
    const user = await this.userRepository.createUser(data);
    return new UserDto(user);
  }

  async updateUser(
    id: string,
    updates: Partial<CreateUserDto>,
  ): Promise<UserDto> {
    const user = await this.userRepository.updateUser(id, updates);
    if (!user) {
      this.logger.info(`User with ID ${id} not found`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return new UserDto(user);
  }
}
