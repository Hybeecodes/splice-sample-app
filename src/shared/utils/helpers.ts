import * as Bcrypt from 'bcryptjs';

export function hashPassword(password: string): string {
  const saltRounds = Bcrypt.genSaltSync(12);
  return Bcrypt.hashSync(password, saltRounds);
}

export function comparePassword(password: string, hash: string): boolean {
  return Bcrypt.compareSync(password, hash);
}

export const redactPaths: string[] = [
  'req.headers.authorization',
  'req.body.password',
  'req.body.creditCard',
  'res.body.sensitiveData',
];
