import { Role } from './auth.enum';

export interface IJwtPayload {
  username: string;
  role: Role;
}

export interface IJwtResponse {
  accessToken: string;
  refreshToken: string;
}
