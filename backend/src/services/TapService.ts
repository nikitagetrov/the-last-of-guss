import prisma from '../database';
import { TapResponse, UserRole } from '../types';
import { calculateScore, isRoundActive } from '../utils';

export class TapService {
  async processTap(userId: string, roundId: string, userRole: UserRole): Promise<TapResponse> {
    return await prisma.$transaction(async (tx) => {
      const round = await tx.round.findUnique({
        where: { id: roundId }
      });
      
      if (!round) {
        throw new Error('Round not found');
      }
      
      if (!isRoundActive(round.startTime, round.endTime)) {
        throw new Error('Round is not active');
      }
      
      let userTap = await tx.userTap.findUnique({
        where: {
          userId_roundId: {
            userId,
            roundId
          }
        }
      });
      
      if (!userTap) {
        userTap = await tx.userTap.create({
          data: {
            userId,
            roundId,
            taps: 0,
            score: 0
          }
        });
      }
      
      const newTapCount = userTap.taps + 1;
      let newScore = userTap.score;
      
      if (userRole !== UserRole.NIKITA) {
        newScore = calculateScore(newTapCount);
      }
      
      await tx.userTap.update({
        where: {
          userId_roundId: {
            userId,
            roundId
          }
        },
        data: {
          taps: newTapCount,
          score: newScore
        }
      });
      
      if (userRole !== UserRole.NIKITA) {
        await tx.round.update({
          where: { id: roundId },
          data: {
            totalTaps: {
              increment: 1
            }
          }
        });
      }
      
      return {
        score: newScore,
        taps: newTapCount
      };
    });
  }
}
