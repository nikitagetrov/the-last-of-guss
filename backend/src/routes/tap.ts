import { FastifyPluginAsync } from 'fastify';
import { TapService } from '../services/TapService';
import { TapRequest, UserRole } from '../types';
import { requireAuth } from '../auth';

const tapService = new TapService();

const tapRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post<{ Body: TapRequest }>('/tap', async (request, reply) => {
    try {
      const user = requireAuth(request);
      const { roundId } = request.body;
      
      const result = await tapService.processTap(user.id, roundId, user.role as UserRole);
      
      return result;
    } catch (error) {
      if (error instanceof Error && error.message === 'Authentication required') {
        return reply.code(401).send({ error: 'Authentication required' });
      }
      if (error instanceof Error && error.message === 'Round not found') {
        return reply.code(404).send({ error: 'Round not found' });
      }
      if (error instanceof Error && error.message === 'Round is not active') {
        return reply.code(400).send({ error: 'Round is not active' });
      }
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
};

export default tapRoutes;
