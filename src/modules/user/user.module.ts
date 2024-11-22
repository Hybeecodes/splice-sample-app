import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { Components } from '../../shared/constants/enumerations';
import { UserService } from './services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UserService,
    {
      provide: Components.USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  controllers: [UserController],
})
export class UserModule {}
