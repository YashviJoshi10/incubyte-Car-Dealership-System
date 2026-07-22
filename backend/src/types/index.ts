// Augment Express Request to include authenticated user payload
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: 'ADMIN' | 'USER';
      };
    }
  }
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: 'ADMIN' | 'USER';
}
