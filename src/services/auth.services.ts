import { httpClient } from '../libs/api';
import type { ApiResponse } from '../types/parking';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'OPERATOR';
  createdAt?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'OPERATOR';
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

export class AuthService {
  private constructor() {}

  static async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await httpClient
      .post('auth/login', { json: payload })
      .json<ApiResponse<LoginResponse>>();

    return response.data;
  }

  static async logout(): Promise<void> {
    await httpClient.post('auth/logout').json<ApiResponse<null>>();
  }

  static async getMe(): Promise<AuthUser> {
    const response = await httpClient
      .get('auth/me')
      .json<ApiResponse<AuthUser>>();

    return response.data;
  }

  static async getUsers(): Promise<AuthUser[]> {
    const response = await httpClient
      .get('auth/users')
      .json<ApiResponse<AuthUser[]>>();

    return response.data;
  }

  static async registerUser(payload: RegisterPayload): Promise<AuthUser> {
    const response = await httpClient
      .post('auth/register', { json: payload })
      .json<ApiResponse<AuthUser>>();

    return response.data;
  }
}
