import prisma from '../database';
import { RoundStatus, RoundInfo } from '../types';
import { getRoundStatus } from '../utils';

export class RoundService {
  async createRound(startTime?: Date): Promise<string> {
    const roundDuration = parseInt(process.env.ROUND_DURATION || '60', 10);
    const cooldownDuration = parseInt(process.env.COOLDOWN_DURATION || '30', 10);
    
    const now = new Date();
    const actualStartTime = startTime || new Date(now.getTime() + cooldownDuration * 1000);
    const endTime = new Date(actualStartTime.getTime() + roundDuration * 1000);
    
    const round = await prisma.round.create({
      data: {
        startTime: actualStartTime,
        endTime,
        status: 'SCHEDULED'
      }
    });
    
    return round.id;
  }
  
  async getRounds(): Promise<RoundInfo[]> {
    const rounds = await prisma.round.findMany({
      include: {
        userTaps: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return rounds.map(round => {
      const status = getRoundStatus(round.startTime, round.endTime);
      
      let winner;
      if (status === 'COMPLETED' && round.userTaps.length > 0) {
        const sortedTaps = round.userTaps
          .filter(tap => tap.user.role !== 'NIKITA')
          .sort((a, b) => b.score - a.score);
        
        if (sortedTaps.length > 0) {
          winner = {
            username: sortedTaps[0].user.username,
            score: sortedTaps[0].score
          };
        }
      }
      
      return {
        id: round.id,
        startTime: round.startTime,
        endTime: round.endTime,
        status: status as RoundStatus,
        totalTaps: round.totalTaps,
        winner
      };
    });
  }
  
  async getRoundInfo(roundId: string, userId?: string): Promise<RoundInfo | null> {
    const round = await prisma.round.findUnique({
      where: { id: roundId },
      include: {
        userTaps: {
          include: {
            user: true
          }
        }
      }
    });
    
    if (!round) {
      return null;
    }
    
    const status = getRoundStatus(round.startTime, round.endTime);
    
    let winner;
    if (status === 'COMPLETED' && round.userTaps.length > 0) {
      const sortedTaps = round.userTaps
        .filter(tap => tap.user.role !== 'NIKITA')
        .sort((a, b) => b.score - a.score);
      
      if (sortedTaps.length > 0) {
        winner = {
          username: sortedTaps[0].user.username,
          score: sortedTaps[0].score
        };
      }
    }
    
    let userScore;
    let userTaps;
    if (userId) {
      const userTap = round.userTaps.find(tap => tap.userId === userId);
      if (userTap) {
        userScore = userTap.score;
        userTaps = userTap.taps;
      }
    }
    
    return {
      id: round.id,
      startTime: round.startTime,
      endTime: round.endTime,
      status: status as RoundStatus,
      totalTaps: round.totalTaps,
      userScore,
      userTaps,
      winner
    };
  }
  
  async updateRoundStatuses(): Promise<void> {
    const rounds = await prisma.round.findMany({
      where: {
        status: {
          in: ['SCHEDULED', 'ACTIVE']
        }
      }
    });
    
    for (const round of rounds) {
      const newStatus = getRoundStatus(round.startTime, round.endTime);
      
      if (newStatus !== round.status) {
        await prisma.round.update({
          where: { id: round.id },
          data: { status: newStatus }
        });
      }
    }
  }
}
