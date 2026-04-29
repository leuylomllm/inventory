import { Request, Response } from "express";
import bcrypt from "bcrypt";
import * as userService from "./indexs";

// Get profile (added logging)
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Invalid user" });

    const user = await userService.getUserById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    delete (user as any).password;
    res.json({ user });
  } catch (err) {
    console.error("getUserProfile error:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Invalid user" });

    const { username, email, password, address } = req.body;

    if (!username || !email) {
      return res.status(400).json({ message: "username and email are required" });
    }
    let hashedPassword: string | undefined;
    if (password && password.trim() !== "") {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const success = await userService.updateUser(userId, {
      username,
      email,
      address: address ?? "",
      ...(hashedPassword ? { password: hashedPassword } : {}),
    });

    if (!success) {
      return res.status(400).json({ message: "Nothing updated or user not found" });
    }

    const updated = await userService.getUserById(userId);
    if (!updated) return res.status(404).json({ message: "User not found after update" });

    delete (updated as any).password;
    res.json({ user: updated });
  } catch (err) {
    console.error("updateUserProfile error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};