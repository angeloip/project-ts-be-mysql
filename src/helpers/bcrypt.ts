import { compare, hash } from "bcrypt";

export const encrypt = async (password: string) => {
  const passwordHash = await hash(password, 5);
  return passwordHash;
};

export const verified = async (password: string, passwordHash: string) => {
  const isMatch = await compare(password, passwordHash);
  return isMatch;
};
