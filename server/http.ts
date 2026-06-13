import type { Request, Response, NextFunction, RequestHandler } from 'express'
import { ZodError } from 'zod'

// Throw this from anywhere in a handler/service to control the HTTP status.
export class HttpError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

// Wrap async handlers so rejected promises reach the error middleware.
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}

// Parse a route :id param into a positive integer or 400.
export function parseId(raw: string): number {
  const id = Number(raw)
  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, `Invalid id: ${raw}`)
  }
  return id
}

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: 'Validation failed', details: err.flatten() })
  }
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message })
  }
  const e = err as { code?: string }
  if (e?.code === 'P2002') {
    return res.status(409).json({ error: 'A record with that unique value already exists.' })
  }
  if (e?.code === 'P2025') {
    return res.status(404).json({ error: 'Record not found.' })
  }
  console.error('Unhandled error:', err)
  return res.status(500).json({ error: 'Internal server error' })
}
