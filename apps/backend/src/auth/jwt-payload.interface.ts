export interface IJwtPayload {
  username: string;
}

export interface IJwtResponse {
  accessToken: string;
  refreshToken: string;
}
