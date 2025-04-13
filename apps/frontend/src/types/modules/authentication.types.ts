export interface AuthCredentials {
  username: string
  password: string
}

export interface JwtResponse {
  accessToken: string
  refreshToken: string
}
