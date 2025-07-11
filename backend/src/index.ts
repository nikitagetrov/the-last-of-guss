import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import authRoutes from './routes/auth';
import roundRoutes from './routes/rounds';
import tapRoutes from './routes/tap';

const fastify = Fastify({ logger: true });

const start = async () => {
  try {
    await fastify.register(cors, {
      origin: 'http://localhost:5173',
      credentials: true
    });
    
    await fastify.register(cookie);
    
    await fastify.register(authRoutes, { prefix: '/api/auth' });
    await fastify.register(roundRoutes, { prefix: '/api' });
    await fastify.register(tapRoutes, { prefix: '/api' });
    
    fastify.get('/health', async () => {
      return { status: 'ok' };
    });
    
    const port = parseInt(process.env.PORT || '3000', 10);
    const host = '0.0.0.0';
    
    await fastify.listen({ port, host });
    console.log(`Server running on http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
