import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

export async function createPlayHistory(userId: string, attempts: number) {
  return prisma.playHistory.create({
    data: {
      userId,
      attempts,
    },
  });
}
