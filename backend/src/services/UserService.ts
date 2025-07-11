import bcrypt from 'bcrypt';
import prisma from '../database';
import { UserRole } from '../types';
import { getUserRole } from '../utils';

export class UserService {
  async createUser(username: string, password: string): Promise<{ id: string; username: string; role: UserRole }> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = getUserRole(username);
    
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role
      }
    });
    
    return {
      id: user.id,
      username: user.username,
      role: user.role as UserRole
    };
  }
  
  async authenticateUser(username: string, password: string): Promise<{ id: string; username: string; role: UserRole } | null> {
    const user = await prisma.user.findUnique({
      where: { username }
    });
    
    if (!user) {
      return null;
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null;
    }
    
    return {
      id: user.id,
      username: user.username,
      role: user.role as UserRole
    };
  }
  
  async getUserById(id: string): Promise<{ id: string; username: string; role: UserRole } | null> {
    const user = await prisma.user.findUnique({
      where: { id }
    });
    
    if (!user) {
      return null;
    }
    
    return {
      id: user.id,
      username: user.username,
      role: user.role as UserRole
    };
  }
}
