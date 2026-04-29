// Add a type declaration for Request.user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        email: string;
        role_name: string;
        [key: string]: any;
      };
    }
  }
}

export {};
