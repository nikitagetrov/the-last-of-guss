import { FastifyPluginAsync } from 'fastify';
import { UserService } from '../services/UserService';
import { LoginRequest } from '../types';
import { generateToken, verifyToken } from '../auth';

const userService = new UserService();

const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post<{ Body: LoginRequest }>('/login', async (request, reply) => {
    try {
      const { username, password } = request.body;
      
      let user = await userService.authenticateUser(username, password);
      
      if (!user) {
        try {
          user = await userService.createUser(username, password);
        } catch (error) {
          return reply.code(400).send({ error: 'Invalid credentials' });
        }
      }
      
      const token = generateToken(user);
      
      reply.setCookie('auth_token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/'
      });
      
      return { user: { id: user.id, username: user.username, role: user.role } };
    } catch (error) {
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
  
  fastify.post('/logout', async (request, reply) => {
    reply.clearCookie('auth_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/'
    });
    return { message: 'Logged out successfully' };
  });
  
  fastify.get('/me', async (request, reply) => {
    try {
      console.log('Cookies received:', request.cookies);
      const token = request.cookies.auth_token;
      if (!token) {
        console.log('No auth token found');
        return reply.code(401).send({ error: 'Not authenticated' });
      }
      
      const userData = verifyToken(token);
      if (!userData) {
        console.log('Invalid token');
        return reply.code(401).send({ error: 'Invalid token' });
      }
      
      const user = await userService.getUserById(userData.id);
      if (!user) {
        console.log('User not found');
        return reply.code(401).send({ error: 'Invalid token' });
      }
      
      return { user: { id: user.id, username: user.username, role: user.role } };
    } catch (error) {
      console.error('Auth error:', error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
};

export default authRoutes;
