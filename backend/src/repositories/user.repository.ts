import { User } from "../models/user.model";

export const findAllUsers = async () => {
  return await User.find();
};

export const findUserById = async (id: string) => {
  return await User.findById(id);
};

export const updateUserById = async (id: string, updates: { name?: string; email?: string }) => {
  return await User.findByIdAndUpdate(id, updates, { new: true });
};

export const createUser = async (data: any) => {
  return await User.create(data);
};

export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};
