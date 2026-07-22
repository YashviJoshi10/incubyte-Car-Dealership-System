import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../types/AppError';

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation error',
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  // Known operational errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // Prisma known errors (e.g. record not found on update)
  if ((err as { code?: string }).code === 'P2025') {
    res.status(404).json({ error: 'Record not found' });
    return;
  }

  // Unexpected errors
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
}
