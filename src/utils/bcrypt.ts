import bcrypt from "bcrypt";

export async function validatePassword(enteredPassword: string, hash: string) {
  return bcrypt.compare(enteredPassword, hash);
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}
