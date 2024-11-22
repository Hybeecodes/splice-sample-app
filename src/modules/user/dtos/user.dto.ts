import { Exclude, Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  public id: string;

  @Expose()
  public name: string;

  @Expose()
  public email: string;

  @Exclude() // Exclude sensitive information like password
  public password: string;

  @Expose()
  public createdAt: Date;

  @Expose()
  public updatedAt: Date;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
