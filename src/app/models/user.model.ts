export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'volunteer';
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
