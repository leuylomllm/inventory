import { Request, Response } from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../../config/db";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

// ===== Register =====
export const handleRegister = async (req: Request, res: Response) => {
    try {
        const { username, email, password, address, role_id } = req.body;
        if (!username || !email || !password || !role_id) return res.status(400).json({ success: false, message: "Missing fields" });

        const [existing]: any = await db.query("SELECT * FROM tbl_users WHERE email = ?", [email]);
        if (existing.length > 0) return res.status(409).json({ success: false, message: "Email exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result]: any = await db.query(
            `INSERT INTO tbl_users (username,email,password,address,role_id,created_at) VALUES (?, ?, ?, ?, ?, NOW())`,
            [username, email, hashedPassword, address || "", role_id]
        );

        const [roleRows]: any = await db.query("SELECT role_name FROM tbl_roles WHERE id = ?", [role_id]);
        const roleName = roleRows[0]?.role_name || "customer";

        const payload = { id: result.insertId, email, role_name: roleName };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

        res.status(201).json({
            success: true,
            token,
            user: { id: result.insertId, username, email, address, role_name: roleName },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Register failed" });
    }
};

// ===== Login =====
export const handleLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const [users]: any = await db.query(
            `SELECT u.*, r.role_name FROM tbl_users u 
             LEFT JOIN tbl_roles r ON u.role_id = r.id
             WHERE u.email = ?`,
            [email]
        );

        if (!users.length) return res.status(401).json({ success: false, message: "Invalid email or password" });

        const user = users[0];
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ success: false, message: "Invalid email or password" });

        const payload = { id: user.id, email: user.email, role_name: user.role_name || "customer" };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

        res.json({ success: true, token, user: { id: user.id, username: user.username, email: user.email, role_name: user.role_name || "customer" } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Login failed" });
    }
};

// ===== Get Profile =====
export const handleGetProfile = async (req: any, res: Response) => {
    try {
        const user = req.user;
        res.json({ success: true, rows: user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to get profile" });
    }
};

// ===== Update Profile (logged-in user) =====
export const handleUpdateProfile = async (req: any, res: Response) => {
    try {
        const id = req.user.id;
        const { username, address, password } = req.body;

        const fields: any = { username, address };
        if (password) fields.password = await bcrypt.hash(password, 10);

        // Prevent overwriting role_id
        const setClause = Object.keys(fields).map(key => `${key}=?`).join(",");
        const values = Object.values(fields);
        values.push(id);

        await db.query(`UPDATE tbl_users SET ${setClause} WHERE id=?`, values);

        const [rows]: any = await db.query(`SELECT u.*, r.role_name FROM tbl_users u LEFT JOIN tbl_roles r ON u.role_id=r.id WHERE u.id=?`, [id]);
        res.json({ success: true, rows: rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to update profile" });
    }
};
