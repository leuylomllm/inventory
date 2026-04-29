import db from "../../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export interface DbUser {
  id: number;
  username: string;
  email: string;
  password?: string;
  address?: string;
  role_id?: number | null;
  created_at?: string;
  isDeleted?: number;
}

export const getUserById = async (id: number): Promise<DbUser | null> => {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT id, username, email, password, address, role_id, created_at, isDeleted FROM tbl_users WHERE id = ?",
    [id]
  );
  if (!rows || rows.length === 0) return null;
  return rows[0] as DbUser;
};

export const updateUser = async (userId: number, payload: any): Promise<boolean> => {
  const sets: string[] = [];
  const params: any[] = [];

  Object.keys(payload).forEach((key) => {
    // Ignore empty password just in case
    if (key === "password" && !payload[key]) return;
    sets.push(`${key} = ?`);
    params.push(payload[key]);
  });

  if (sets.length === 0) return false;

  const sql = `UPDATE tbl_users SET ${sets.join(", ")} WHERE id = ?`;
  params.push(userId);

  const [result] = await db.query<ResultSetHeader>(sql, params);
  return result.affectedRows > 0;
};

