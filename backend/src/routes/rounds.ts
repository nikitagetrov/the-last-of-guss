import { FastifyPluginAsync } from 'fastify';
import { RoundService } from '../services/RoundService';
import { CreateRoundRequest } from '../types';
import { requireAuth, requireAdmin } from '../auth';

const roundService = new RoundService();

const roundRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/rounds', async (request, reply) => {
    try {
      const user = requireAuth(request);
      await roundService.updateRoundStatuses();
      const rounds = await roundService.getRounds();
      return { rounds };
    } catch (error) {
      if (error instanceof Error && error.message === 'Authentication required') {
        return reply.code(401).send({ error: 'Authentication required' });
      }
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
  
  fastify.get<{ Params: { id: string } }>('/rounds/:id', async (request, reply) => {
    try {
      const user = requireAuth(request);
      const { id } = request.params;
      
      await roundService.updateRoundStatuses();
      const round = await roundService.getRoundInfo(id, user.id);
      
      if (!round) {
        return reply.code(404).send({ error: 'Round not found' });
      }
      
      return { round };
    } catch (error) {
      if (error instanceof Error && error.message === 'Authentication required') {
        return reply.code(401).send({ error: 'Authentication required' });
      }
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
  
  fastify.post<{ Body: CreateRoundRequest }>('/rounds', async (request, reply) => {
    try {
      const user = requireAdmin(request);
      const { startTime } = request.body;
      
      const roundId = await roundService.createRound(startTime);
      
      return { roundId };
    } catch (error) {
      if (error instanceof Error && error.message === 'Authentication required') {
        return reply.code(401).send({ error: 'Authentication required' });
      }
      if (error instanceof Error && error.message === 'Admin access required') {
        return reply.code(403).send({ error: 'Admin access required' });
      }
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
};

export default roundRoutes;
