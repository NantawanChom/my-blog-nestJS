export interface JwtPayload {
    username: string;
    password: string;
    iat?: number; // Issued at (optional)
    exp?: number; // Expiration time (optional)
  }