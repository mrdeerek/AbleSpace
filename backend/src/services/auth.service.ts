import { createUser, findUserByEmail } from "../repositories/user.repository";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(password);

  const user: any = await createUser({
    name,
    email,
    password: hashedPassword,
  });

  // ✅ use _id and convert to string
  const token = generateToken((user as any)._id.toString());

  return {
    user: {
      id: (user as any)._id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};

export const loginUser = async (email: string, password: string) => {
  const user: any = await findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken((user as any)._id.toString());

  return {
    user: {
      id: (user as any)._id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};
