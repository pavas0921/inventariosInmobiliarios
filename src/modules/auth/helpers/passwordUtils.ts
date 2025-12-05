import * as bcrypt from 'bcrypt';

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  const decryptedPassword = bcrypt.compare(plainPassword, hashedPassword);
  return decryptedPassword;
};
