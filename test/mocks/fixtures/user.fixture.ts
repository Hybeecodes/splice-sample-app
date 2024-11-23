import { faker } from '@faker-js/faker';
import { User } from "../../../src/modules/user/entities/user.entity";
import { hashPassword } from "../../../src/shared/utils/helpers";

export const getRecord = (overrides: Partial<User> = {}): User => {
  const user = new User();
  user.id = faker.string.uuid();
  user.email = faker.internet.email();
  user.password = hashPassword(faker.internet.password());
  user.firstName = faker.person.firstName();
  user.lastName = faker.person.lastName();
  user.createdAt = new Date();
  user.updatedAt = new Date();
  user.deletedAt = null;
  if (overrides) {
    Object.assign(user, overrides);
  }
  return user;
};
