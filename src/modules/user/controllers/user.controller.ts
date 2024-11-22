import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @InjectPinoLogger(UserController.name)
    private readonly logger: PinoLogger,
  ) {}

  @Post('')
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.createUser(createUserDto);
      this.logger.info('User created successfully', { user });
      return user;
    } catch (error) {
      this.logger.error('Error creating user', { error });
      throw error;
    }
  }
}
