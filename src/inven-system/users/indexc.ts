import { Request, Response } from "express";
import {
  createUser,
  deleteUser,
  formLoadUser,
  getUserById,
  getUsers,
  updateUser,
} from "./indexs";
import { UserInfoMapper } from "./indext";
import bcrypt from "bcrypt";
import db from "../../config/db";
export const handleGetUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsers(); // no req needed
    res.json({
      status: 200,
      rows: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//=== Get supplier by ID ===

export const handleGetUserById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = await getUserById(id); // req.params.id needed
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      rows: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//=== Create supplier with hash password ===

export const handleCreateUser = async (req: Request, res: Response) => {
  try {
    const data = req.body as any;
    const mappedData = UserInfoMapper(data);
    const rows: any = await createUser(mappedData); // req.body needed
    if (!rows) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(rows);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//=== Update supplier ===

export const handleUpdateUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const data = req.body as any;
    const mappedData = UserInfoMapper(data);

    const rows: any = await updateUser(id, mappedData);
    if (!rows) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//=== Delete supplier ===

export const handleDeleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const rows: any = await deleteUser(id); // req.params.id needed
    if (!rows) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(rows);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//=== Form Load User ===

export const handleFormLoadUser = async (req: Request, res: Response) => {
  try {
    const rows = await formLoadUser(); // no req needed
    res.json({
      status: 200,
      rows,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// === Get logged-in user's profile ===
export const handleGetProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id; // provided by authMiddleware
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      status: 200,
      rows: user,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const handleUpdateProfile = async (req: any, res: Response) => {
  try {
    const id = req.user.id;
    const { username, address, password } = req.body;

    // Only update editable fields
    const fields: any = { username, address };
    if (password) {
      fields.password = await bcrypt.hash(password, 10);
    }

    const setClause = Object.keys(fields)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(fields);
    values.push(id);

    await db.query(`UPDATE tbl_users SET ${setClause} WHERE id = ?`, values);

    const [rows]: any = await db.query(
      `SELECT u.*, r.role_name 
       FROM tbl_users u 
       LEFT JOIN tbl_roles r ON u.role_id = r.id 
       WHERE u.id = ?`,
      [id]
    );

    res.json({ success: true, rows: rows[0] });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to update profile" });
  }
};
