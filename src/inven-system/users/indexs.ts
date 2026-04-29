import db from "../../config/db";
import { User } from "./indext";
import bcrypt from "bcrypt";
export const getUsers = async () : Promise<User[]> => {
    const [rows] = await db.query(`
    SELECT 
        u.id,
        u.username,
        u.email,
        u.address,
        u.role_id,
        r.role_name
    FROM tbl_users u
    LEFT JOIN tbl_roles r ON u.role_id = r.id
    WHERE u.isDeleted = 0
    ORDER BY u.username ASC
    `);
    return rows as User[];
};


//=== Get user by ID === 

export const getUserById = async (id: number) : Promise<User | null> => {
    const [rows]: any = await db.query("SELECT * FROM tbl_users WHERE id = ?", [id]);
    return rows.length > 0 ? rows[0] as User : null;
};

//=== Create user ==

export const createUser = async (user: Omit<User, "id" | "created_at">): Promise<void> => {
    const { username, email, password, address, role_id } = user;
    const hash = await bcrypt.hash(password, 10);
    const [rows]: any = await db.query("INSERT INTO tbl_users (username, email, password, address, role_id) VALUES (?, ?, ?, ?, ?)",
      [username, email, hash, address, role_id]
    );
    return rows;
};

//=== Update user ===

// export const updateUser = async (id: number, user: Omit<User, "id" | "created_at">): Promise<void> => {
//     const { username, email, password, address, role_id } = user;
//     const hash = await bcrypt.hash(password, 10);
//     const [rows]: any = await db.query("UPDATE tbl_users SET username = ?, email = ?, password = ?, address = ?, role_id = ? WHERE id = ?",
//       [username, email, hash, address, role_id, id]
//     );
//     return rows;
// };
export const updateUser = async (id: number, user: Omit<User, "id" | "created_at">): Promise<any> => {
  const { username, email, password, address, role_id } = user;

  // 🔒 If password provided, hash it; otherwise, keep the old password
  let hashedPassword: string | null = null;
  if (password && password.trim() !== "") {
    hashedPassword = await bcrypt.hash(password, 10);
  } else {
    const [existing]: any = await db.query("SELECT password FROM tbl_users WHERE id = ?", [id]);
    if (existing.length > 0) {
      hashedPassword = existing[0].password; // keep old one
    }
  }

  const [rows]: any = await db.query(
    "UPDATE tbl_users SET username = ?, email = ?, password = ?, address = ?, role_id = ? WHERE id = ?",
    [username, email, hashedPassword, address, role_id, id]
  );

  return rows;
};


//=== Delete user ===

export const deleteUser = async (id: number): Promise<void> => {
    const [rows]: any = await db.query("UPDATE tbl_users SET isDeleted = 1 WHERE id = ?", [id]);
    return rows;
};


//=== Form Load User ===

export const formLoadUser = async () => {
    const [rows] = await db.query(`
    SELECT 
        r.id,
        r.role_name
    FROM tbl_roles r
    ORDER BY r.role_name ASC
    `);
    return rows;
};
