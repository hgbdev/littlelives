import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string) {
  if (!password) {
    return null;
  }

  const saltOrRounds = 10;
  const hash = await bcrypt.hash(password, saltOrRounds);

  return hash;
}

export function checkPasswordMatch(
  password: string,
  hashedPassword: string,
): boolean {
  return bcrypt.compareSync(password, hashedPassword);
}

export function businessResponse(
  message: string,
  statusCode = 200,
  data?: any,
) {
  return {
    message,
    statusCode,
    data,
  };
}
