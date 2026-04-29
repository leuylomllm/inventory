export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  address?: string;
  role_id?: number;
  created_at: Date;
}

export interface Role {
  id: number;
  role_name: string;
}

export function UserInfoMapper(user: User): User {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    password: user.password,
    address: user.address,
    role_id: user.role_id,
    created_at: user.created_at,
  };
}
