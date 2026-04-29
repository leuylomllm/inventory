import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import db from "../config/db";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

interface AuthRequest extends Request {
    user?: any;
}

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET) as any;

        const [rows]: any = await db.query(
            `SELECT u.*, r.role_name FROM tbl_users u 
             LEFT JOIN tbl_roles r ON u.role_id = r.id 
             WHERE u.id = ?`,
            [decoded.id]
        );

        const user = rows[0];
        if (!user) return res.status(401).json({ success: false, message: "User not found" });

        req.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            role_id: user.role_id,
            role_name: user.role_name || "customer",
        };

        next();
    } catch (err) {
        console.error("Auth error:", err);
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
};

export default authMiddleware;
