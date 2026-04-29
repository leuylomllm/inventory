import { NextFunction, Request, Response } from "express";

export const permit = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !allowedRoles.includes(user.role_name)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }
    next();
  };
};

//== By Permission ==
export const permission = (...allowedPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (
      !user ||
      !user.permissions ||
      !Array.isArray(user.permissions) ||
      !user.permissions.some((p: string) => allowedPermissions.includes(p))
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }
    next();
  };
};
