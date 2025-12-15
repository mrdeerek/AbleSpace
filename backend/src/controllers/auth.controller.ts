import { Request, Response } from "express";
import { RegisterDto, LoginDto } from "../dtos/auth.dto";
import { registerUser, loginUser } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const data = RegisterDto.parse(req.body);
    const result = await registerUser(
      data.name,
      data.email,
      data.password
    );

    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = LoginDto.parse(req.body);
    const result = await loginUser(data.email, data.password);

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
