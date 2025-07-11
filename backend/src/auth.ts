import jwt from 'jsonwebtoken';
import { FastifyRequest } from 'fastify';

export interface AuthenticatedUser {
  id: string;
  username: string;
  role: string;
}

export const generateToken = (user: AuthenticatedUser): string => {
  return jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: '24h' });
};

export const verifyToken = (token: string): AuthenticatedUser | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as AuthenticatedUser;
  } catch {
    return null;
  }
};

export const authenticateUser = (request: FastifyRequest): AuthenticatedUser | null => {
  const token = request.cookies.auth_token;
  if (!token) return null;
  
  return verifyToken(token);
};

export const requireAuth = (request: FastifyRequest): AuthenticatedUser => {
  const user = authenticateUser(request);
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
};

export const requireAdmin = (request: FastifyRequest): AuthenticatedUser => {
  const user = requireAuth(request);
  if (user.role !== 'ADMIN') {
    throw new Error('Admin access required');
  }
  return user;
};
